# from fastapi import FastAPI, File, UploadFile
# import subprocess
# import os
# from fastapi.staticfiles import StaticFiles
# from fastapi.responses import HTMLResponse, JSONResponse
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Serve the frontend build folder as static files
# app.mount("/", StaticFiles(directory="static", html=True), name="static")

# # Serve the index.html for the frontend app (React)
# @app.get("/")
# async def serve_index():
#     try:
#         # Ensure the file is being served from 'static'
#         with open("static/index.html") as f:
#             return HTMLResponse(f.read())
#     except FileNotFoundError:
#         return HTMLResponse("index.html not found", status_code=404)

# # Handle file uploads
# @app.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     try:
#         # Log the name and size of the uploaded file
#         print(f"Received file: {file.filename} with size {file.spool_max_size}")

#         # Ensure temp directory exists
#         os.makedirs("temp", exist_ok=True)

#         # Save the uploaded file temporarily
#         file_location = f"temp/{file.filename}"
#         with open(file_location, "wb") as f:
#             f.write(file.file.read())
        
#         # Log that the file was saved
#         print(f"File saved to: {file_location}")

#         # Run Pylint on the uploaded file
#         result = subprocess.run(
#             ["pylint", file_location, "--output-format=json"],
#             capture_output=True,
#             text=True
#         )

#         # Return the output of the Pylint analysis
#         return JSONResponse(
#             status_code=200,
#             content={
#                 "status": "success",
#                 "message": "File uploaded and analyzed successfully.",
#                 "output": result.stdout or result.stderr
#             }
#         )
#     except Exception as e:
#         print(f"Error: {str(e)}")
#         # If there is an error, send an error message
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "status": "error",
#                 "message": f"Failed to upload file: {str(e)}"
#             }
#         )

# # Add CORS middleware to allow frontend to communicate with the backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow requests from any origin (you can be more specific)
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# )

from fastapi import FastAPI, File, UploadFile
import subprocess
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Adjust frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

        return JSONResponse(
            status_code=200,
            content={
                "status": "success", 
                "message": "File uploaded and analyzed.", 
                "output": result.stdout or result.stderr
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

