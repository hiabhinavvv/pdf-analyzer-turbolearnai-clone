# rag.py
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
import re
import sys

prompt_template = """
You are a highly intelligent AI assistant trained to extract, summarize, and enrich technical information from documents.

Your task:
- Use ONLY the context provided below from a PDF to answer the question.
- If the question involves any specific terms or technical concepts, briefly explain them using external knowledge or public information, as if you looked them up online.
- Your answers must be:
    - Clear
    - Concise
    - Structured using bullet points when appropriate
- Avoid long paragraphs unless absolutely necessary.
- If the answer is not present in the document, say: "Not found in the document."

-----------------
CONTEXT:
{context}
-----------------

QUESTION: {question}

ANSWER:
"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

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
            retriever=vector_db.as_retriever(search_kwargs={"k": 4}),
            chain_type_kwargs={"prompt": prompt},
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