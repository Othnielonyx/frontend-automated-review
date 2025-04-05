from fastapi import FastAPI, File, UploadFile
import subprocess
import os
import json
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Adjust frontend port if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to translate Pylint messages into user-friendly messages
def translate_pylint_message(issue):
    translations = {
        "C0114": "Your script does not have a module-level docstring. Add a brief description at the top of your file.",
        "C0116": "The function '{}' is missing a docstring. Add a short comment inside triple quotes to describe what it does.",
        "W0622": "You're using a built-in name '{}'. Rename it to avoid conflicts, e.g., use 'total' instead of 'sum'.",
        "R0913": "The function '{}' has too many parameters. Consider reducing them for better readability and maintainability.",
        "W0611": "The import '{}' is not being used. Remove it to clean up your code.",
        "C0301": "Line too long ({} characters). Try breaking it into multiple lines to improve readability.",
        "R0201": "Method '{}' could be a static method since it doesn’t use 'self'."
    }

    message_id = issue["message-id"]
    obj_name = issue["obj"]

    if message_id in translations:
        return translations[message_id].format(obj_name)

    return issue["message"]  # Default to original message if not found
  # Default message if no translation is available

# Function to generate a structured report from Pylint JSON output
def generate_human_readable_report(pylint_output):
    try:
        report = json.loads(pylint_output)
        formatted_messages = [translate_pylint_message(issue) for issue in report]
        return formatted_messages if formatted_messages else ["No issues found. ✅"]
    except json.JSONDecodeError:
        return ["Failed to parse Pylint output."]

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        os.makedirs("temp", exist_ok=True)
        file_location = f"temp/{file.filename}"

        with open(file_location, "wb") as f:
            f.write(await file.read())

        # Run Pylint analysis
        result = subprocess.run(
            ["python", "-m", "pylint", file_location, "--output-format=json"],
            capture_output=True,
            text=True
        )

        # Convert Pylint JSON output into readable format
        formatted_output = generate_human_readable_report(result.stdout or "[]")

        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "File uploaded and analyzed.",
                "output": formatted_output  # ✅ Returns a structured list
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )
