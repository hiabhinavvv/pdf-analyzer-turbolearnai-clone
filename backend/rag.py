# rag.py
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
import re
import sys

def remove_think_blocks(text):
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

def query_document(question, filename):
    try:
        # Load ChromaDB
        vector_db = Chroma(
            embedding_function=HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            ),
            persist_directory="./chroma_db"
        )

        # Initialize LLM
        llm = Ollama(model="deepseek-r1")

        # Set up RAG chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_db.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=False
        )

        # Get answer
        result = qa_chain.invoke({"query": question})
        return remove_think_blocks(result["result"])
    except Exception as e:
        return f"Error processing query: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python rag.py <filename> <question>")
        sys.exit(1)
    
    filename = sys.argv[1]
    question = sys.argv[2]
    answer = query_document(question, filename)
    print(answer)