import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify'
 
export const AddLivro = ({ onAdd }) => {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [status, setStatus] = useState("Status");

    // Função para criar o POST
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!titulo || !autor){
            toast.warn("Preencha título e autor");
            return;
        }

        try{
            const res = await axios.post("https://backend-lib-yv4d.onrender.com/livros", 
                {titulo, 
                autor,
                status});

            onAdd(res.data);
            setTitulo(""),
            setAutor(""),
            setStatus("Status");

        } catch (err) {
            console.error("Erro ao adicionar um livro", err);
        };
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-md"
            >
            <input 
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="border rounded-lg p-2 w-full sm:w-1/3"
            />

            <input 
                type="text"
                placeholder="Autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="border rounded-lg p-2 w-full sm:w-1/3"
            />

            <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-lg p-2 cursor-pointer"
            >
                <option value="Status" disabled>Status</option>
                <option value="PretendoLer">Pretendo Ler</option>
                <option value="Lido">Lido</option>
                <option value="EmLeitura">Em Leitura</option>
            </select>

            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">Adicionar</button>

        </form>
    )
}