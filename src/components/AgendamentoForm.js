import React, { useState } from 'react';

const AgendamentoForm = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [data, setData] = useState('');
    const [erros, setErros] = useState({});

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validarCNPJ = (cnpj) => {
        return cnpj.length === 14 && /^\d+$/.test(cnpj);
    };

    const validarTelefone = (telefone) => {
        return telefone.length >= 10 && /^\d+$/.test(telefone);
    };

    const validarData = (data) => {
        const dataSelecionada = new Date(data);
        const hoje = new Date();
        return dataSelecionada > hoje;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const novosErros = {};

        if (!nome || nome.length < 2) {
            novosErros.nome = "O nome deve ter pelo menos 2 caracteres.";
        }

        if (!validarEmail(email)) {
            novosErros.email = "Por favor, insira um email válido.";
        }

        if (!validarCNPJ(cnpj)) {
            novosErros.cnpj = "O CNPJ deve ter 14 dígitos.";
        }

        if (!validarTelefone(telefone)) {
            novosErros.telefone = "O telefone deve ter pelo menos 10 dígitos.";
        }

        if (!validarData(data)) {
            novosErros.data = "A data deve ser futura.";
        }

        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return;
        }

        const agendamento = { nome, email, cnpj, telefone, data };

        try {
            const response = await fetch('http://localhost:5000/agendar', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(agendamento),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || "Erro ao agendar.");
            }

            const result = await response.json();
            alert(result.mensagem);
        } catch (error) {
            console.error('Erro ao agendar:', error);
            alert(error.message || 'Erro ao agendar. Tente novamente mais tarde.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Agendamento de Suporte</h2>
            <div>
                <label>Nome:</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                {erros.nome && <p style={{ color: 'red' }}>{erros.nome}</p>}
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {erros.email && <p style={{ color: 'red' }}>{erros.email}</p>}
            </div>
            <div>
                <label>CNPJ:</label>
                <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                />
                {erros.cnpj && <p style={{ color: 'red' }}>{erros.cnpj}</p>}
            </div>
            <div>
                <label>Telefone:</label>
                <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                />
                {erros.telefone && <p style={{ color: 'red' }}>{erros.telefone}</p>}
            </div>
            <div>
                <label>Data e Horário:</label>
                <input
                    type="datetime-local"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
                {erros.data && <p style={{ color: 'red' }}>{erros.data}</p>}
            </div>
            <button type="submit">Agendar</button>
        </form>
    );
};

export default AgendamentoForm;