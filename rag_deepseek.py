from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from chromadb.config import Settings as ChromaSettings
from langchain.embeddings import HuggingFaceEmbeddings
import re

# Function to remove <think>...</think> blocks from output
def remove_think_blocks(text):
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

def main():
    # 1. Load ChromaDB with telemetry disabled
    vector_db = Chroma(
        embedding_function=HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        ),
        persist_directory="./chroma_db"
    )

    # 2. Initialize DeepSeek-R1
    llm = Ollama(model="deepseek-r1")

    # 3. Set up RAG chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_db.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True
    )

    print("PDF Q&A System Ready. Type '/exit' to quit.\n")

    while True:
        query = input("\nYour question: ").strip()
        if query.lower() == "/exit":
            break
        
        if query:
            try:
                raw_answer = qa_chain.invoke({"query": query})["result"]
                cleaned_answer = remove_think_blocks(raw_answer)
                print(f"\nAnswer: {cleaned_answer}\n")
            except Exception as e:
                print(f"Error: {e}")

if __name__ == "__main__":
    main()
