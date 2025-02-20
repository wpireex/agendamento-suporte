import React, { useState } from 'react';

const AgendamentoForm = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        const agendamento = { nome, email, cnpj, telefone, data };

        console.log('Dados Enviados:', agendamento);

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
        } finally {
            setLoading(false);
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
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>CNPJ:</label>
                <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Telefone:</label>
                <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Data e Horário:</label>
                <input
                    type="datetime-local"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Agendando...' : 'Agendar'}
            </button>
        </form>
    );
};

export default AgendamentoForm;