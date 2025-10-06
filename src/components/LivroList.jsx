import { useState, useEffect } from 'react';
import axios from 'axios';
import { AddLivro } from './AddLivro';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LivroList = () => {
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editLivro, setEditLivro] = useState(null);
    const [deleteLivro, setDeleteLivro] = useState(null);

    const fetchLivro = () => {
        axios.get("https://backend-lib-yv4d.onrender.com/livros")
        .then((res) => {
            setLivros(res.data)
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
            toast.error("Erro ao carregar livros.");
        });
    };

    useEffect(() => {
        fetchLivro();
    },[]);

    // Adicionar Livros
    const handleAddLivro = (novoLivro) => {
        toast.success(`Livro "${novoLivro.titulo}" adicionado!`);
        fetchLivro();
    };

    // Editar
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`https://backend-lib-yv4d.onrender.com/livro/${editLivro.id}`, editLivro);
            const livroAtualizado = res.data;

            toast.success(`Livro "${livroAtualizado.titulo}" atualizado!`);
            setEditLivro(null);

            fetchLivro();

        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar livro");
        }
    };

    // Excluir livro
    const handleDelete = async () => {
        try {
            await axios.delete(`https://backend-lib-yv4d.onrender.com/livro/${deleteLivro.id}`);
            toast.info(`Livro "${deleteLivro.titulo}" excluído!`);
            setDeleteLivro(null);

            fetchLivro();

        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir livro");
        }
    };
    
    // Formatar Status
    const formatarStatus = (status) => {
        switch (status) {
            case "PretendoLer":
                return "Pretendo Ler";
            case "EmLeitura":
                return "Em Leitura";
            default:
                return status;
        }
    }


    if (loading) return <div className='flex justify-center items-center min-h-screen font-bold'>Carregando Livros...</div>

    return (
        <div className='p-6'>
            <ToastContainer position='top-right' autoClose={3000} />

            <AddLivro onAdd={handleAddLivro} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {livros.map((livro) => {
                    // Cores dinâmicas por status
                    const status = livro.status?.trim();
                    let statusColor = "bg-gray-100 text-gray-700";
                    if (status === "Lido") statusColor = "bg-green-100 text-green-700";
                    else if (status === "EmLeitura") statusColor = "bg-yellow-100 text-yellow-700";
                    else if (status === "PretendoLer") statusColor = "bg-red-100 text-red-700";


                    return (
                        <div
                            key={livro.id}
                            className="p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col justify-between cursor-pointer"
                        >
                            <div>
                                <h2 className="font-bold text-xl text-gray-800 mb-2">
                                    {livro.titulo}
                                </h2>
                                <p className="text-gray-500">{livro.autor}</p>
                                <span className={`inline-block mt-2 px-2 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                                    {formatarStatus(livro.status)}
                                </span>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex justify-end mt-4 space-x-3">
                                <button
                                    onClick={() => setEditLivro(livro)}
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="Editar"
                                >
                                    <FaEdit size={20} />
                                </button>
                                <button
                                    onClick={() => setDeleteLivro(livro)}
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    title="Excluir"
                                >
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de edição */}
            {editLivro && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleEditSubmit}
                        className="bg-white p-6 rounded-xl shadow-md w-96"
                    >
                        <h2 className="text-xl font-bold mb-4">Editar Livro</h2>
                        <input
                            type="text"
                            value={editLivro.titulo}
                            onChange={(e) => setEditLivro({ ...editLivro, titulo: e.target.value })}
                            className="border p-2 w-full mb-3 rounded"
                            placeholder="Título"
                        />
                        <input
                            type="text"
                            value={editLivro.autor}
                            onChange={(e) => setEditLivro({ ...editLivro, autor: e.target.value })}
                            className="border p-2 w-full mb-3 rounded"
                            placeholder="Autor"
                        />
                        <select
                            value={editLivro.status}
                            onChange={(e) => setEditLivro({ ...editLivro, status: e.target.value })}
                            className="border p-2 w-full mb-3 rounded"
                        >
                            <option value="PretendoLer">Pretendo Ler</option>
                            <option value="EmLeitura">Em Leitura</option>
                            <option value="Lido">Lido</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setEditLivro(null)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {deleteLivro && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-md w-80">
                        <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
                        <p className="mb-4">Deseja realmente excluir o livro "{deleteLivro.titulo}"?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteLivro()}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}