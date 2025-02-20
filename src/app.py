from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite todas as origens (apenas para desenvolvimento)

@app.route('/agendar', methods=['POST'])
def agendar():
    try:
        dados = request.json
        print("Dados recebidos:", dados)

        # Validação básica dos dados
        if not dados.get('nome') or not dados.get('email') or not dados.get('cnpj') or not dados.get('telefone') or not dados.get('data'):
            return jsonify({"erro": "Todos os campos são obrigatórios."}), 400

        return jsonify({"mensagem": "Agendamento recebido com sucesso!"}), 201
    except Exception as e:
        print("Erro:", str(e))
        return jsonify({"erro": "Ocorreu um erro ao processar o agendamento."}), 500

if __name__ == '__main__':
    app.run(debug=True)