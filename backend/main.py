from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
import subprocess

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update if React runs on another port
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QueryRequest(BaseModel):
    question: str
    filename: str

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        # Save the uploaded file
        with open(file_location, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # Run embedder script
        process = subprocess.Popen(
            ["python", "embedder.py", file_location],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait for completion with timeout (60 seconds)
        try:
            _, stderr = process.communicate(timeout=60)
            if process.returncode != 0:
                raise HTTPException(
                    status_code=500,
                    detail=f"Embedding failed: {stderr.decode()}"
                )
        except subprocess.TimeoutExpired:
            process.kill()
            raise HTTPException(
                status_code=500,
                detail="Embedding process timed out"
            )
        
        return {
            "message": "File uploaded and processed",
            "filename": file.filename,
            "success": True
        }
    except Exception as e:
        # Clean up if something went wrong
        if os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.delete("/delete/{filename}")
async def delete_file(filename: str):
    try:
        # Security check - prevent directory traversal
        if '../' in filename or '..\\' in filename:
            raise HTTPException(status_code=400, detail="Invalid filename")
            
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Delete the main file
        os.remove(file_path)
        print(f"Deleted file: {file_path}")  # For debugging

        shutil.rmtree("chroma_db", ignore_errors=True)  # Deletes entire ChromaDB directory
        
        # Delete associated files (embeddings, etc.)
        base_name = os.path.splitext(filename)[0]
        associated_files = [
            f"embeddings/{base_name}.pkl",
            f"embeddings/{base_name}.index",
            f"processed/{base_name}.txt"
        ]
        
        for associated_file in associated_files:
            if os.path.exists(associated_file):
                os.remove(associated_file)
                print(f"Deleted associated file: {associated_file}")
        
        return {"message": f"File {filename} deleted successfully", "success": True}
    except HTTPException:
        raise  # Re-raise HTTPException as is
    except Exception as e:
        print(f"Error deleting file {filename}: {str(e)}")  # For debugging
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")
    

@app.post("/query/")
async def handle_query(query: QueryRequest):
    try:
        # Here you would call your RAG script with the question and filename
        # For now, we'll simulate it with a subprocess call
        result = subprocess.run(
            ["python", "rag.py", query.filename, query.question],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail="Error processing query")
            
        return {"answer": result.stdout.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))