# InsightPDF - PDF Interaction with LLMs

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Key Features](#key-features)
4. [Installation & Setup](#installation--setup)
5. [Development Roadmap](#development-roadmap)
6. [Deployment Options](#deployment-options)
7. [Contributing](#contributing)
8. [License](#license)

## Project Overview

StudyAI is an interactive document analysis platform that allows users to:
- Upload PDF documents
- Process them into vector embeddings
- Have natural language conversations about the content using local LLMs
- Retrieve precise answers with source context

This project demonstrates a complete RAG (Retrieval-Augmented Generation) pipeline built with open-source tools, designed to run entirely locally without expensive API calls.

## Technical Architecture

### System Components

1. **Frontend (React)**
   - File upload interface
   - Document management dashboard
   - Chat interface for Q&A
   - Responsive design with Lucide icons

2. **Backend (FastAPI)**
   - File upload endpoint
   - Document processing pipeline
   - Query handling
   - CORS management

3. **AI Pipeline**
   - **Embedding Model**: `all-MiniLM-L6-v2` (Sentence Transformers)
   - **Vector Store**: ChromaDB (local persistence)
   - **LLM**: Mistral via Ollama (local inference)
   - **RAG Implementation**: LangChain orchestration

### Data Flow
```
User PDF → FastAPI → Embedder → ChromaDB → RAG Chain → LLM → Response
```

## Key Features

### Document Processing
- PDF text extraction with PyPDFLoader
- Chunking with overlap for context preservation (1000 chars chunks, 200 overlap)
- Local embedding generation (CPU/GPU optimized)
- Persistent vector storage

### Chat Interface
- Context-aware question answering
- Technical enrichment of responses
- Strict no-hallucination policy
- Markdown-formatted responses

### Management Features
- File upload with progress tracking
- Document deletion with cleanup
- Session-based chat
- Error handling throughout pipeline

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- Ollama installed and running
- 8GB+ RAM recommended

### Setup Steps

1. **Backend Setup**
```bash
# Clone repository
git clone https://github.com/yourusername/studyai.git
cd studyai/backend

# Create virtual environment (Optional)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload
```

2. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

3. **Ollama Setup**
```bash
ollama pull mistral
```

## Development Roadmap

### Short-term Improvements
1. **Enhanced PDF Handling**
   - Support for scanned PDFs (OCR integration)
   - Table extraction capabilities
   - Multi-page document navigation

2. **Performance Optimizations**
   - Batch processing for large documents
   - Background queue for uploads
   - Caching frequent queries

3. **UI/UX Enhancements**
   - Document preview pane
   - Citation highlighting
   - Conversation history saving

### Medium-term Goals
1. **Containerization & Deployment**
   - Docker support for easy setup
   - One-click deployment scripts
   - Cloud deployment guides

2. **Alternative LLM Integrations**
   - Local: Llama 3, Phi-3
   - Cloud: OpenAI (when budget allows)
   - Hybrid mode for cost optimization

3. **Advanced Features**
   - Multi-document cross-referencing
   - Automated summarization
   - Concept mapping

### Long-term Vision
1. **Collaboration Features**
   - Shared document workspaces
   - Annotation system
   - Version tracking

2. **Educational Integrations**
   - Quiz generation
   - Flashcard creation
   - Learning progress tracking

## Deployment Options

### Local Deployment
- Ideal for single-user scenarios
- Requires manual setup as per installation
- Lowest latency for document processing

### Cloud Deployment
1. **AWS Options**
   - EC2 for full control
   - Lambda + S3 for serverless
   - ECS for containerized deployments

2. **Budget Considerations**
   - t3.medium (~$30/month)
   - Lambda pay-per-use model
   - Spot instances for batch processing

## License

MIT License - Free for academic and non-commercial use. Commercial licenses available.
