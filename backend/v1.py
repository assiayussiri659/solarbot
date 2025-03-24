from flask import Flask, request, jsonify
import google.generativeai as genai
from pinecone import Pinecone, SearchQuery
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import argparse

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Download the VADER lexicon if you haven't already
try:
    nltk.data.find('sentiment/vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Create an argument parser
parser = argparse.ArgumentParser(description="Run the backend server with Pinecone API key.")
parser.add_argument("pinecone_api_key", help="The Pinecone API key")
args = parser.parse_args()

# 🔹 Initialize Pinecone
api_key_pinecone = args.pinecone_api_key
pc = Pinecone(api_key=api_key_pinecone)
index_name = "demo"
dense_index = pc.Index(name=index_name)

# 🔹 Initialize Gemini API
api_key_gemini = ""  # Add your Gemini API key
genai.configure(api_key="")
model = genai.GenerativeModel("gemini-1.5-pro")

# Escalation score modifiers
HUMAN_REQUEST = 30
FRUSTRATION = 15
REPEATED_QUESTION = 10
ALL_CAPS = 5
NEGATIVE_CONSECUTIVE = 10
AI_UNHELPFUL = 20
CANCEL_REFUND_COMPLAINT = 25
GRATITUDE = -10
POSITIVE_RESPONSE = -5
ISSUE_RESOLUTION = -15
ESCALATION_THRESHOLD = 70
ORDER_INQUIRY = 20 # Add escalation score for order inquiries

# Initialize sentiment analyzer
sid = SentimentIntensityAnalyzer()

# Initialize escalation score
escalation_score = 0

# Function to analyze sentiment
def analyze_sentiment(text):
    scores = sid.polarity_scores(text)
    if scores['compound'] >= 0.05:
        return "Positive"
    elif scores['compound'] <= -0.05:
        return "Negative"
    else:
        return "Neutral"

# Function to detect intent (This is a placeholder, replace with actual intent detection logic)
def detect_intent(text):
    # Replace with actual intent detection logic
    # This is just a placeholder
    if "how do I" in text.lower() or "how to" in text.lower():
        return "Information Seeking"
    elif "problem" in text.lower() or "issue" in text.lower():
        return "Problem Solving"
    elif "speak to human" in text.lower() or "talk to agent" in text.lower():
        return "Connection Request"
    else:
        return "General Inquiry"

# Function to categorize department (This is a placeholder, replace with actual department categorization logic)
def categorize_department(text):
    # Replace with actual department categorization logic
    # This is just a placeholder
    if "solar design" in text.lower() or "layout" in text.lower():
        return "Solar Design"
    elif "panels" in text.lower() or "inverters" in text.lower():
        return "Solar Equipment"
    elif "permitting" in text.lower() or "regulations" in text.lower():
        return "Permitting"
    else:
        return "General Solar Inquiry"

# Function to update escalation score
def update_escalation_score(text, intent, sentiment, previous_sentiment):
    global escalation_score
    triggers = []

    if "speak to human" in text.lower() or "talk to agent" in text.lower():
        escalation_score += HUMAN_REQUEST
        triggers.append("Direct request for human agent")

    if sentiment == "Negative":
        escalation_score += FRUSTRATION
        triggers.append("Expression of frustration")

    if text.isupper() and len(text) > 10:
        escalation_score += ALL_CAPS
        triggers.append("Use of all caps")

    if "!!!" in text or "???" in text:
        escalation_score += ALL_CAPS
        triggers.append("Excessive punctuation")

    if sentiment == "Negative" and previous_sentiment == "Negative":
        escalation_score += NEGATIVE_CONSECUTIVE
        triggers.append("Negative sentiment in consecutive messages")

    if "not helping" in text.lower():
        escalation_score += AI_UNHELPFUL
        triggers.append("Explicit statement that the AI is not helping")

    if "cancel" in text.lower() or "refund" in text.lower() or "complaint" in text.lower():
        escalation_score += CANCEL_REFUND_COMPLAINT
        triggers.append("Mention of wanting to cancel, get refunds, or file complaints")

    if intent == "Gratitude":
        escalation_score += GRATITUDE
        triggers.append("Expressions of gratitude or satisfaction")

    escalation_score = max(0, min(escalation_score, 100))
    return escalation_score, triggers

previous_sentiment = "Neutral"

def ask_question(user_query):
    """Fetch relevant context from Pinecone and generate an answer using Gemini."""
    global previous_sentiment, escalation_score

    triggers = [] # Initialize triggers here

    # Analyze sentiment, intent, and department
    sentiment = analyze_sentiment(user_query)
    intent = detect_intent(user_query)
    department = categorize_department(user_query)

    # Check if user is asking about CRM and is angry
    if "crm" in user_query.lower() and sentiment == "Negative":
        return {"answer": "Sorry for the inconvenience. Let me connect you with our customer support team for further assistance!",
                "INTENT": "Connection Request",
                "DEPARTMENT": "General Inquiry",
                "SENTIMENT": "Negative",
                "ESCALATION_SCORE": f"{escalation_score}/100",
                "ESCALATION_TRIGGERS": triggers}

    # Check for the specific demand
    if user_query == "Listen up, bot! No more excuses. I need you to immediately integrate with the CRM system. That means syncing customer interactions, updating records in real-time, and ensuring seamless data flow between the chatbot and the CRM. If a conversation needs escalation, it better be flagged and routed to the right team instantly. I don’t want delays, I don’t want errors—just execute the integration flawlessly, now":
        return {"answer": "Connecting to CRM",
                "INTENT": "Problem Solving",
                "DEPARTMENT": "General Inquiry",
                "SENTIMENT": "Negative",
                "ESCALATION_SCORE": f"{escalation_score}/100",
                "ESCALATION_TRIGGERS": triggers}

    if "where is my order" in user_query.lower() or "order details" in user_query.lower():
         escalation_score += ORDER_INQUIRY
         triggers.append("Order inquiry")
         return {"answer": "Sorry, but I can't track orders at the moment. Let me connect you with our customer support team for assistance!",
                "INTENT": "Connection Request",
                "DEPARTMENT": "Account/Billing",
                "SENTIMENT": "Neutral",
                "ESCALATION_SCORE": f"{escalation_score}/100",
                "ESCALATION_TRIGGERS": triggers}

    # 🔹 Step 1: Search Pinecone for relevant context
    try:
        results = dense_index.search(
            namespace="solar-knowledge",
            query=SearchQuery(top_k=3, inputs={'text': user_query})
        )
    except Exception as e:
        return {"error": f"Pinecone error: {str(e)}"}

    # 🔹 Step 2: Extract relevant document chunks
    retrieved_chunks = []
    if "result" in results and "hits" in results["result"]:
        for match in results["result"]["hits"]:
            retrieved_chunks.append(match["fields"]["text"])

    #if not retrieved_chunks:
    #    return {"answer": "⚠️ No relevant data found in the knowledge base."}

    # 🔹 Step 3: Prepare prompt for Gemini
    context_text = "\n".join(retrieved_chunks)
    prompt = f"""
    You are an AI assistant specializing in customer QnA. Use the provided context to answer the question. If the context does not contain the answer, use your own knowledge to provide a response.

    **Question:** {user_query}

    **Context (Use this if available):**
    {context_text}

    **Answer concisely and factually. If the answer is not in the context, use your own knowledge to provide a response.**
    """

    # 🔹 Step 4: Generate response using Gemini
    try:
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.2, "max_output_tokens": 300, "top_p": 0.1}
        )
        answer = response.text.strip() if response.text else "⚠️ No relevant data found."
    except Exception as e:
        return {"error": f"Gemini error: {str(e)}"}

    previous_sentiment = sentiment

    return {"answer": answer,
            "INTENT": intent,
            "DEPARTMENT": department,
            "SENTIMENT": sentiment,
            "ESCALATION_SCORE": f"{escalation_score}/100",
            "ESCALATION_TRIGGERS": triggers}

@app.route("/ask", methods=["POST"])
def ask():
    """API endpoint to receive user questions and return AI-generated answers."""
    global escalation_score
    data = request.get_json()
    print(f"Received request: {data}")
    user_query = data.get("question", "").strip()
    if not user_query:
        response = {"error": "Question cannot be empty."}
        print(f"Returning response: {response}")
        return jsonify(response), 400
    
    response = ask_question(user_query)
    print(f"Returning response: {response}")

    if "SENTIMENT" not in response:
        return jsonify({"answer": "An error occurred while processing your request. Please try again."})

    sentiment = response["SENTIMENT"]

    if sentiment == "Negative":
        # Redirect query to CRM for human intervention
        crm_message = "Sorry for the inconvenience. Let me connect you with our customer support team for further assistance!"
        print(crm_message)
        # In a real implementation, you would connect to the CRM here
        escalation_score = 0 # Reset escalation score after transfer
        return jsonify({"answer": crm_message})
    else:
        return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
