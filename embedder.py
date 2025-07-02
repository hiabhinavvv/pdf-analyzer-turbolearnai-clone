import os
import shutil
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings

def get_pdf_path():
    """Prompt user for PDF path and validate it exists"""
    while True:
        pdf_path = input("Enter the path to your PDF file (Complete Path): ").strip()
        if os.path.isfile(pdf_path) and pdf_path.lower().endswith('.pdf'):
            return pdf_path
        print("Invalid path or file is not a PDF. Please try again.")

def clear_chroma_db(db_path="./chroma_db"):
    """Remove existing ChromaDB directory if it exists"""
    if os.path.exists(db_path):
        try:
            shutil.rmtree(db_path)
            print(f"Removed existing ChromaDB at '{db_path}'")
        except Exception as e:
            print(f"Error removing existing ChromaDB: {e}")
            raise

def create_vector_db(pdf_path, db_path="./chroma_db"):
    """Create new Chroma vector database from PDF"""
    try:
        # 1. Load and Split PDF
        print(f"Loading PDF: {pdf_path}")
        loader = PyPDFLoader(pdf_path)
        pages = loader.load_and_split()

        # 2. Split into Chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,  # Increased for better context
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )
        chunks = text_splitter.split_documents(pages)
        print(f"Split PDF into {len(chunks)} chunks")

        # 3. Create VectorDB (ChromaDB)
        print("Creating vector database...")
        vector_db = Chroma.from_documents(
            documents=chunks,
            embedding=HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            ),
            persist_directory=db_path
        )
        print(f"VectorDB created successfully at '{db_path}'")
        return vector_db

    except Exception as e:
        print(f"Error creating vector database: {e}")
        raise

def main():
    try:
        # Get user input
        pdf_path = get_pdf_path()
        
        # Clear existing DB
        clear_chroma_db()
        
        # Create new DB
        vector_db = create_vector_db(pdf_path)
        
        # You can now use vector_db for your RAG pipeline
        # For example:
        # retriever = vector_db.as_retriever()
        # qa_chain = create_qa_chain(retriever)  # Your existing chain creation
        
    except Exception as e:
        print(f"Operation failed: {e}")
        return

if __name__ == "__main__":
    main()