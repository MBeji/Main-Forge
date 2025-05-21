import pytest
import os
import io
from app.main import app, extract_text_from_file, parse_llm_response, get_llm_analysis
from werkzeug.datastructures import FileStorage

# Define the path to the sample files directory
SAMPLE_FILES_DIR = os.path.join(os.path.dirname(__file__), 'sample_files')

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['UPLOAD_FOLDER'] = os.path.join(SAMPLE_FILES_DIR, 'uploads_test') # Use a test-specific upload folder
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    # Mock environment variable for API key if not set, to avoid test failure on that
    if not os.environ.get('OPENAI_API_KEY'):
        os.environ['OPENAI_API_KEY'] = 'test_env_api_key' # Mock env key for tests
        
    with app.test_client() as client:
        yield client

# --- Tests for extract_text_from_file ---

def test_extract_text_from_txt():
    filepath = os.path.join(SAMPLE_FILES_DIR, 'sample.txt')
    text = extract_text_from_file(filepath)
    # sample.txt created by 'echo' includes a newline
    assert text == "This is a test TXT file.\n"

def test_extract_text_from_pdf_mocked(mocker):
    mocker.patch('PyPDF2.PdfReader') # Mock the PdfReader
    filepath = os.path.join(SAMPLE_FILES_DIR, 'sample.pdf')
    # This will now not actually read the file but test the path
    # Depending on how extract_text_from_file is structured, it might return empty or error
    # For this test, we assume it might return empty if PdfReader is mocked without return value
    text = extract_text_from_file(filepath)
    assert text == "" # Or assert based on mock's behavior if specified

def test_extract_text_from_docx_mocked(mocker):
    mocker.patch('docx.Document') # Mock the Document class
    filepath = os.path.join(SAMPLE_FILES_DIR, 'sample.docx')
    text = extract_text_from_file(filepath)
    assert text == "" # Or assert based on mock's behavior

def test_extract_text_non_existent_file():
    filepath = os.path.join(SAMPLE_FILES_DIR, 'non_existent_file.txt')
    text = extract_text_from_file(filepath)
    assert "Error extracting text: [Errno 2] No such file or directory" in text

def test_extract_text_unsupported_file():
    filepath = os.path.join(SAMPLE_FILES_DIR, 'sample.jpg')
    text = extract_text_from_file(filepath)
    # The function should ideally return a specific message for unsupported types,
    # or empty string if it only tries to process known types.
    # Current implementation will return empty string as it doesn't have a specific handler for .jpg
    assert text == "" 

# --- Tests for parse_llm_response ---

PERFECT_LLM_RESPONSE = """
**Summary:**
This is a test summary.

**Key Requirements:**
- Requirement 1
- Requirement 2: Sub-requirement

**Potential Challenges:**
- Challenge A
- Challenge B

**Overall Recommendation:** GO

**Reasoning for Recommendation:**
The project aligns with our goals.
"""

MISSING_SECTIONS_RESPONSE = """
**Summary:**
Only summary is available.

**Key Requirements:**
- Req A
"""

UNSTRUCTURED_RESPONSE = "This is just some random text from the LLM."

def test_parse_llm_perfect_response():
    parsed = parse_llm_response(PERFECT_LLM_RESPONSE)
    assert parsed['summary'] == "This is a test summary."
    assert "Requirement 1" in parsed['requirements']
    assert "Requirement 2: Sub-requirement" in parsed['requirements']
    assert "Challenge A" in parsed['challenges']
    assert "Challenge B" in parsed['challenges']
    assert parsed['recommendation'] == "GO"
    assert parsed['reasoning'] == "The project aligns with our goals."

def test_parse_llm_missing_sections():
    parsed = parse_llm_response(MISSING_SECTIONS_RESPONSE)
    assert parsed['summary'] == "Only summary is available."
    assert "Req A" in parsed['requirements']
    assert parsed['challenges'] == "Not available" # Default value
    assert parsed['recommendation'] == "UNCERTAIN" # Default
    assert parsed['reasoning'] == "Not available"

def test_parse_llm_recommendations():
    go_response = "**Overall Recommendation:** GO"
    assert parse_llm_response(go_response)['recommendation'] == "GO"

    nogo_response = "**Overall Recommendation:** NO-GO"
    assert parse_llm_response(nogo_response)['recommendation'] == "NO-GO"
    
    uncertain_response = "**Overall Recommendation:** UNCERTAIN"
    assert parse_llm_response(uncertain_response)['recommendation'] == "UNCERTAIN"

    # Test with slightly different formatting
    go_response_variant = "**Overall Recommendation:** Go for it"
    assert parse_llm_response(go_response_variant)['recommendation'] == "GO"


def test_parse_llm_unstructured_response():
    parsed = parse_llm_response(UNSTRUCTURED_RESPONSE)
    assert parsed['summary'] == "Not available"
    assert parsed['requirements'] == "Not available"
    assert parsed['challenges'] == "Not available"
    assert parsed['recommendation'] == "UNCERTAIN"
    assert parsed['reasoning'] == "Not available" # Or it might contain the unstructured string based on implementation

def test_parse_llm_error_response():
    error_input = "Error: API connection failed."
    parsed = parse_llm_response(error_input)
    assert parsed['summary'] == "Not available"
    assert parsed['recommendation'] == "UNCERTAIN"
    assert parsed['reasoning'] == error_input


# --- Tests for Flask App Routes ---

def test_get_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"<title>Analyse d'Appel d'Offres</title>" in response.data
    assert b"OpenAI API Key" in response.data

def test_post_upload_success(client, mocker):
    # Mock external dependencies
    mocker.patch('werkzeug.utils.secure_filename', return_value='test.txt')
    mock_file_save = mocker.patch('werkzeug.datastructures.FileStorage.save')
    mock_extract = mocker.patch('app.main.extract_text_from_file', return_value="Mocked extracted text")
    mock_llm_analysis = mocker.patch('app.main.get_llm_analysis', return_value=PERFECT_LLM_RESPONSE)

    data = {
        'file': (io.BytesIO(b"dummy file content"), 'test.txt'),
        'api_key': 'test_api_key_form' 
    }
    response = client.post('/', data=data, content_type='multipart/form-data')

    assert response.status_code == 200
    mock_file_save.assert_called_once()
    mock_extract.assert_called_once()
    mock_llm_analysis.assert_called_once_with("Mocked extracted text", 'test_api_key_form')
    
    assert b"Mocked extracted text" in response.data
    assert b"This is a test summary." in response.data # From parsed LLM response
    assert b"Recommandation Globale : GO" in response.data

def test_post_upload_no_file(client):
    data = {'api_key': 'test_api_key'}
    response = client.post('/', data=data, content_type='multipart/form-data')
    assert response.status_code == 200 # Current app returns 200 but shows error
    assert b"No file selected or file part missing." in response.data

def test_post_upload_no_api_key(client, mocker):
    # Ensure no env API key is set for this specific test
    mocker.patch.dict(os.environ, {"OPENAI_API_KEY": ""})
    
    data = {'file': (io.BytesIO(b"dummy file content"), 'test.txt')}
    response = client.post('/', data=data, content_type='multipart/form-data')
    
    assert response.status_code == 200 # App returns 200 but shows error
    assert b"OpenAI API Key not found." in response.data

def test_text_extraction_failure(client, mocker):
    mocker.patch('werkzeug.utils.secure_filename', return_value='test.txt')
    mocker.patch('werkzeug.datastructures.FileStorage.save')
    mock_extract = mocker.patch('app.main.extract_text_from_file', return_value="Error extracting text: Critical Failure")

    data = {
        'file': (io.BytesIO(b"dummy file content"), 'test.txt'),
        'api_key': 'test_api_key'
    }
    response = client.post('/', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    assert b"Error extracting text: Critical Failure" in response.data
    assert b"Analyse LLM" not in response.data # LLM analysis should not be present

def test_llm_api_failure(client, mocker):
    mocker.patch('werkzeug.utils.secure_filename', return_value='test.txt')
    mocker.patch('werkzeug.datastructures.FileStorage.save')
    mocker.patch('app.main.extract_text_from_file', return_value="Mocked extracted text")
    mock_llm_analysis = mocker.patch('app.main.get_llm_analysis', return_value="Error interacting with OpenAI API: API Down")

    data = {
        'file': (io.BytesIO(b"dummy file content"), 'test.txt'),
        'api_key': 'test_api_key'
    }
    response = client.post('/', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    assert b"Error interacting with OpenAI API: API Down" in response.data
    assert b"Recommandation Globale" not in response.data # Parsed analysis should not be there
