from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pireex:200021%40As@127.0.0.1/agendamento_db?client_encoding=utf8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de Agendamento
class Agendamento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)  # Campo maior para evitar erros com nomes grandes
    email = db.Column(db.String(255), nullable=False)
    cnpj = db.Column(db.String(14), nullable=False)
    telefone = db.Column(db.String(15), nullable=False)
    data = db.Column(db.DateTime, nullable=False)

# Funções de validação
def validar_email(email):
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(regex, email) is not None

def validar_cnpj(cnpj):
    return len(cnpj) == 14 and cnpj.isdigit()

def validar_telefone(telefone):
    return len(telefone) >= 10 and telefone.isdigit()

def validar_data(data):
    try:
        data_selecionada = datetime.fromisoformat(data)
        return data_selecionada > datetime.now()
    except ValueError:
        return False

@app.route('/agendar', methods=['POST'])
def agendar():
    try:
        dados = request.json

        # Validações
        if not dados.get('nome') or len(dados['nome']) < 2:
            return jsonify({"erro": "O nome deve ter pelo menos 2 caracteres."}), 400

        if not dados.get('email') or not validar_email(dados['email']):
            return jsonify({"erro": "Por favor, insira um email válido."}), 400

        if not dados.get('cnpj') or not validar_cnpj(dados['cnpj']):
            return jsonify({"erro": "O CNPJ deve ter 14 dígitos."}), 400

        if not dados.get('telefone') or not validar_telefone(dados['telefone']):
            return jsonify({"erro": "O telefone deve ter pelo menos 10 dígitos."}), 400

        if not dados.get('data') or not validar_data(dados['data']):
            return jsonify({"erro": "A data deve ser futura e no formato correto (YYYY-MM-DDTHH:MM:SS)."}), 400

        # Salvar no banco de dados
        novo_agendamento = Agendamento(
            nome=dados['nome'],
            email=dados['email'],
            cnpj=dados['cnpj'],
            telefone=dados['telefone'],
            data=datetime.fromisoformat(dados['data'])
        )
        db.session.add(novo_agendamento)
        db.session.commit()

        return jsonify({"mensagem": "Agendamento salvo com sucesso!"}), 201
    except Exception as e:
        db.session.rollback()
        print("Erro detalhado:", repr(e))  # Log mais detalhado
        return jsonify({"erro": "Ocorreu um erro ao processar o agendamento."}), 500

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Tabelas criadas com sucesso!")
        except Exception as e:
            print("Erro ao criar tabelas:", repr(e))  # Log mais detalhado
    
    app.run(debug=True)
