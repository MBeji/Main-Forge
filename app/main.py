import os
import logging
from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import openai
import re
import sys

# Basic logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Define UPLOAD_FOLDER relative to the application's root directory
# __file__ is app/main.py, so os.path.dirname(__file__) is app/
# Then os.path.join(..., '..', 'uploads_main_app') becomes /uploads_main_app (relative to project root if app is project root)
# This should be /app/uploads_main_app if the project root is one level above 'app' directory
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DEFAULT_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'uploads_instance') # Changed to be inside app directory for clarity
app.config.setdefault('UPLOAD_FOLDER', DEFAULT_UPLOAD_FOLDER)

# Defer directory creation until app is run or configured, not at import time.
# The test client fixture will handle its own UPLOAD_FOLDER creation.

def get_llm_analysis(text_content, api_key):
    if not api_key:
        logger.error("get_llm_analysis called without API key.")
        return "Error: OpenAI API Key is missing."
    
    openai.api_key = api_key
    
    prompt_text = f"""
You are an expert assistant helping to decide whether to respond to a call for tenders.
Based on the following call for tenders text, please provide your analysis in the following structured format:

**Summary:**
[Provide a brief summary of the project here]

**Key Requirements:**
- [Requirement 1]
- [Requirement 2]
...

**Potential Challenges:**
- [Challenge 1]
- [Challenge 2]
...

**Overall Recommendation:** [GO / NO-GO / UNCERTAIN]

**Reasoning for Recommendation:**
[Explain your recommendation here]

Call for Tenders Text:
---
{text_content}
---
Analysis:
"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert assistant helping to decide whether to respond to a call for tenders."},
                {"role": "user", "content": prompt_text}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Exception during OpenAI API call: {str(e)}")
        return f"Error interacting with OpenAI API: {str(e)}"

def parse_llm_response(llm_text):
    parsed_data = {
        "summary": "Not available",
        "requirements": "Not available",
        "challenges": "Not available",
        "recommendation": "UNCERTAIN",
        "reasoning": "Not available"
    }
    if not llm_text or llm_text.startswith("Error"):
        # Log if the input text itself is an error message
        if llm_text and llm_text.startswith("Error"):
            logger.warning(f"parse_llm_response received error text: {llm_text}")
        parsed_data["reasoning"] = llm_text # Put the error message in reasoning
        return parsed_data

    sections = {
        "Summary": "summary",
        "Key Requirements": "requirements",
        "Potential Challenges": "challenges",
        "Overall Recommendation": "recommendation",
        "Reasoning for Recommendation": "reasoning"
    }
    
    current_section_key = None
    
    # Split by lines and process
    lines = llm_text.splitlines()
    buffer = []

    for line in lines:
        is_heading = False
        for heading, key in sections.items():
            if line.strip().startswith(f"**{heading}:**"):
                if current_section_key and buffer: # Save previous section's content
                    parsed_data[current_section_key] = "\n".join(buffer).strip()
                
                buffer = [line.replace(f"**{heading}:**", "").strip()] # Start new buffer with content after heading
                current_section_key = key
                is_heading = True
                break
        
        if not is_heading and current_section_key:
            buffer.append(line.strip())
            
    if current_section_key and buffer: # Save the last section's content
         parsed_data[current_section_key] = "\n".join(buffer).strip()

    # Specific handling for recommendation to ensure it's one of the expected values
    rec = parsed_data.get("recommendation", "").upper()
    if "GO" in rec and "NO-GO" not in rec: # Check for "GO" but not "NO-GO"
        parsed_data["recommendation"] = "GO"
    elif "NO-GO" in rec:
        parsed_data["recommendation"] = "NO-GO"
    elif "UNCERTAIN" in rec:
        parsed_data["recommendation"] = "UNCERTAIN"
    else: # Default if no clear keyword found, or if parsing failed for it
        # Try to extract from the raw text if it was short and simple
        if parsed_data["recommendation"] and len(parsed_data["recommendation"].split()) < 4:
             # Keep whatever was parsed if it's short, otherwise default
             pass # keep potentially parsed value
        else:
            parsed_data["recommendation"] = "UNCERTAIN"


    # If some sections are still "Not available", it means parsing might have failed.
    # We can try a more lenient split if the primary method didn't work well.
    if parsed_data["summary"] == "Not available" and parsed_data["reasoning"] == "Not available":
        try:
            summary_match = re.search(r"\*\*Summary:\*\*(.*?)\*\*Key Requirements:\*\*", llm_text, re.DOTALL | re.IGNORECASE)
            if summary_match: parsed_data["summary"] = summary_match.group(1).strip()

            requirements_match = re.search(r"\*\*Key Requirements:\*\*(.*?)\*\*Potential Challenges:\*\*", llm_text, re.DOTALL | re.IGNORECASE)
            if requirements_match: parsed_data["requirements"] = requirements_match.group(1).strip()
            
            challenges_match = re.search(r"\*\*Potential Challenges:\*\*(.*?)\*\*Overall Recommendation:\*\*", llm_text, re.DOTALL | re.IGNORECASE)
            if challenges_match: parsed_data["challenges"] = challenges_match.group(1).strip()

            recommendation_match = re.search(r"\*\*Overall Recommendation:\*\*(.*?)\*\*Reasoning for Recommendation:\*\*", llm_text, re.DOTALL | re.IGNORECASE)
            if recommendation_match:
                rec_text = recommendation_match.group(1).strip().upper()
                if "GO" in rec_text and "NO-GO" not in rec_text: parsed_data["recommendation"] = "GO"
                elif "NO-GO" in rec_text: parsed_data["recommendation"] = "NO-GO"
                elif "UNCERTAIN" in rec_text: parsed_data["recommendation"] = "UNCERTAIN"
                else: parsed_data["recommendation"] = recommendation_match.group(1).strip() # keep as is

            reasoning_match = re.search(r"\*\*Reasoning for Recommendation:\*\*(.*)", llm_text, re.DOTALL | re.IGNORECASE)
            if reasoning_match: parsed_data["reasoning"] = reasoning_match.group(1).strip()
        except Exception:
            # If regex fails, stick to original parsing or defaults
            pass
            
    return parsed_data

def extract_text_from_file(filepath):
    text = ""
    file_extension = os.path.splitext(filepath)[1].lower()
    try:
        if file_extension == '.txt':
            with open(filepath, 'r', encoding='utf-8') as f:
                text = f.read()
        elif file_extension == '.pdf':
            with open(filepath, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page_num in range(len(reader.pages)):
                    page_text = reader.pages[page_num].extract_text()
                    if page_text:
                        text += page_text
        elif file_extension == '.docx':
            doc = docx.Document(filepath)
            for para in doc.paragraphs:
                text += para.text + '\n'
    except Exception as e:
        logger.error(f"Error extracting text from {filepath}: {str(e)}")
        return f"Error extracting text: {str(e)}"
    return text

@app.route('/', methods=['GET', 'POST'])
def index():
    extracted_text = None
    error_message = None
    llm_analysis_raw = None
    parsed_analysis = None
    # Try to get API key from environment first, then from form (if POST), then empty string
    api_key_value = os.environ.get('OPENAI_API_KEY', '')
    form_api_key = request.form.get('api_key') if request.method == 'POST' else ''


    if request.method == 'POST':
        # Prioritize environment variable, but allow override from form
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key: # If not in env
            api_key = request.form.get('api_key')
            if api_key:
                logger.info("Using API key from form input.")
                api_key_value = api_key # Ensure this is passed back to template
            else:
                logger.warning("OpenAI API Key not found in environment variables or form input.")
                error_message = 'OpenAI API Key not found. Please set OPENAI_API_KEY environment variable or provide it in the form.'
                # Render template directly with error
                return render_template('index.html', 
                                       extracted_text=extracted_text, 
                                       error_message=error_message, 
                                       parsed_analysis=parsed_analysis, 
                                       api_key=form_api_key) # Pass form key back
        elif request.form.get('api_key'): # Env key exists, but form key also provided
            api_key = request.form.get('api_key') # Form overrides env
            logger.info("Using API key from form input (overriding environment variable).")
            api_key_value = api_key # Ensure this is passed back to template
        else: # Only env key exists and is used
            logger.info("Using API key from environment variable.")
            api_key_value = '' # Clear form field if env key is used and no form key provided


        if 'file' not in request.files or request.files['file'].filename == '':
            error_message = 'No file selected or file part missing.'
        else:
            file = request.files['file']
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            try:
                file.save(filepath)
                logger.info(f"File '{filename}' uploaded successfully to {filepath}.")
                extracted_text = extract_text_from_file(filepath)

                if extracted_text and not extracted_text.startswith("Error extracting text:"):
                    logger.info("Sending request to OpenAI API.")
                    llm_analysis_raw = get_llm_analysis(extracted_text, api_key)
                    if llm_analysis_raw and not llm_analysis_raw.startswith("Error interacting with OpenAI API"):
                        logger.info("Received analysis from OpenAI API.")
                        parsed_analysis = parse_llm_response(llm_analysis_raw)
                    else:
                        logger.error(f"OpenAI API error: {llm_analysis_raw}")
                        error_message = llm_analysis_raw # Show API error to user
                        parsed_analysis = None 
                elif extracted_text.startswith("Error extracting text:"):
                    # Error already logged in extract_text_from_file
                    error_message = extracted_text 
            except Exception as e:
                logger.error(f"Error saving or processing file '{filename}': {str(e)}")
                error_message = f"Error saving or processing file: {str(e)}"

    # For GET requests, or if POST had errors that didn't return early
    # api_key_value for GET will be env key or empty. For POST, it's what was used or empty if env was used.
    # If form_api_key is present (from a POST), it should be used to repopulate the field.
    # If env key was used and form_api_key is empty, api_key_value will be empty (don't show env key in form)
    final_api_key_for_template = form_api_key if form_api_key else api_key_value

    return render_template('index.html', 
                           extracted_text=extracted_text, 
                           error_message=error_message, 
                           parsed_analysis=parsed_analysis, 
                           api_key=final_api_key_for_template)

if __name__ == '__main__':
    # Create the upload folder if it doesn't exist when running the app directly
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
