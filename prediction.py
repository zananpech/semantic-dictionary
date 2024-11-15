import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

# Example text data
corpus = [
    "I love programming in Python",
    "Python is a great programming language",
    "I love learning new things in Python",
    "Programming in Python is fun"
]

# Step 1: Preprocess and prepare n-grams
# We will use a bigram model (2-grams)
vectorizer = CountVectorizer(ngram_range=(2, 2))  # Create bigrams (2-grams)
X = vectorizer.fit_transform(corpus)

# Step 2: Create the target (next word prediction)
# For simplicity, we will predict the next word as the last word in the sequence
y = [sentence.split()[1:] for sentence in corpus]  # Next words are the words after the first one
y = [" ".join(words) for words in y]

# Step 3: Split the data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Step 4: Train a classifier (Naive Bayes)
model = MultinomialNB()
model.fit(X_train, y_train)

# Step 5: Predict the next word for new input text
input_text = ["I love programming"]
input_vect = vectorizer.transform(input_text)
predicted_next_word = model.predict(input_vect)

print(f"Predicted next word: {predicted_next_word[0]}")

# Optional: Evaluate model accuracy
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))


