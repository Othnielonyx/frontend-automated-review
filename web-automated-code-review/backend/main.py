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

