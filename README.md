# LLM Decision Helper for Call for Tenders

## Description
This application helps users decide whether to respond to a call for tenders. It analyzes the tender document (TXT, PDF, or DOCX) by extracting its text content and then using an OpenAI Large Language Model (LLM) to provide a structured analysis and recommendation.

## Features
*   Upload call for tenders documents in various formats (TXT, PDF, DOCX).
*   Extracts text content from the uploaded documents.
*   Utilizes OpenAI's LLM (specifically, GPT-3.5-turbo by default) to analyze the extracted text.
*   Provides a structured analysis, including:
    *   A brief summary of the project.
    *   Key requirements and objectives.
    *   Potential challenges, risks, or unclear points.
    *   An overall recommendation (Go/No-Go/Uncertain) with supporting reasoning.
*   Simple web interface for easy file upload and interaction.

## Prerequisites
*   Python 3.8+
*   pip (Python package installer)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> 
    ```
    (Replace `<repository-url>` with the actual URL of the repository)

2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory-name>
    ```

3.  **Create and activate a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    # For Windows:
    # venv\Scripts\activate
    ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Set up OpenAI API Key:**
    You need an active OpenAI API key to use the LLM features. It's recommended to set this as an environment variable for security and convenience.

    *   On Linux/macOS:
        ```bash
        export OPENAI_API_KEY='your_actual_api_key'
        ```
    *   On Windows (Command Prompt):
        ```bash
        set OPENAI_API_KEY=your_actual_api_key
        ```
    *   On Windows (PowerShell):
        ```powershell
        $env:OPENAI_API_KEY='your_actual_api_key'
        ```
    Replace `your_actual_api_key` with your actual OpenAI API key.
    
    Alternatively, you can enter the API key directly into the form field in the web application. However, using an environment variable is generally preferred.

## Running the Application

1.  **Start the Flask development server:**
    Make sure your virtual environment is activated and you are in the root project directory.
    ```bash
    python app/main.py
    ```

2.  **Access the application:**
    Open your web browser and navigate to:
    `http://127.0.0.1:5000/`

## How to Use

1.  Navigate to the application in your web browser (`http://127.0.0.1:5000/`).
2.  If you have not set the `OPENAI_API_KEY` environment variable, enter your OpenAI API key in the designated field on the webpage. If the environment variable is set, you can leave this field blank unless you want to override the environment variable.
3.  Click "Choose File" (or "Browse", depending on your browser) to select the call for tenders document you wish to analyze. Supported formats are TXT, PDF, and DOCX.
4.  Click the "Analyser" button.
5.  Wait for the application to process the file and query the LLM.
6.  Review the extracted text from your document and the LLM's structured analysis, which includes the project summary, key requirements, potential challenges, and a Go/No-Go/Uncertain recommendation with reasoning.

## Running Tests

Unit tests are located in the `tests/` directory and can be run using `pytest`.

1.  Ensure you have installed the development dependencies (including `pytest` and `pytest-mock` as per `requirements.txt`).
2.  From the root project directory, run:
    ```bash
    pytest
    ```
    Or, to be more explicit:
    ```bash
    python -m pytest tests/
    ```

This will execute all tests and report the results.
