
from flask_cors import CORS, cross_origin
from flask import Flask, request, jsonify
import pandas as pd
import spacy


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["*"]}}) 
@app.route('/HELLO', methods=['GET'])
@cross_origin()
def hello():
    print("Saving data to database...")
    return jsonify({'status': 'success','msg':'hello!'}), 200

@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file)

        # Process the DataFrame (Example: Add nlp_output column)
        df['nlp_output'] = df.apply(lambda row: pos_tagging(row['Name'], row['Description']), axis=1)

        # Convert DataFrame back to JSON
        response = jsonify(df.to_dict(orient='records'))
        return response

    return jsonify({'error': 'File processing error'}), 400

@app.route('/save', methods=['POST'])
def save_data():
    username = request.form.get('Username')
    email = request.form.get('Email')
    nlp_output = request.form.get('NLP_Output')

    if not all([username, email, nlp_output]):
        return jsonify({'error': 'Missing required fields'}), 400

    data = {
        'Username': username,
        'Email': email,
        'NLP_Output': nlp_output
    }

    save_to_csv(data)
    return jsonify({'message': 'User data saved successfully'}), 201

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    #if username == 'testuser' and email == 'test@example.com':
    return jsonify({'token': 'fake-jwt-token'}), 200
    #else:
    #    return jsonify({'error': 'Invalid credentials'}), 401

def save_to_csv(data, filename='user_data.csv'):
    fieldnames = ['Username', 'Email', 'NLP_Output']  # Define field names in your CSV

    with open(filename, mode='a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        # Write header only if the file is empty
        if file.tell() == 0:
            writer.writeheader()

        writer.writerow(data)


def pos_tagging(name,description):
  spacy_pipeline = spacy.load("en_core_web_sm", disable = ['parser','lemmatizer'])
  processed_text = spacy_pipeline(description)
  tagged_text = " ".join([token.pos_ for token in processed_text])
  return name.upper() + " || " + tagged_text

if __name__ == '__main__':
 app.run(host='0.0.0.0', port=8000, debug=True)