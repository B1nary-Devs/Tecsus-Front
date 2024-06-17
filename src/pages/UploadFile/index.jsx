import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { toast } from "react-toastify";
import './upload.css';
import Loader from '../../components/loader';
import Sidebar from '../../components/sidebar/sidebar';
import Title from '../../components/title/title';
import { GrDocumentCsv } from "react-icons/gr";

export default function UploadFile() {
    const [csvData, setCsvData] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);
    const [fileActivate, setFileActivate] = useState(null);
    const [typeFile, setTypeFile] = useState('con_agua.csv');
    const [loader, setLoader] = useState(false);

    async function upload() {
        if (!csvData || !fileInfo) {
            toast.warning('Por favor, carregue um arquivo antes de fazer o upload');
            return;
        }

        // Verifica se o nome do arquivo corresponde ao tipo selecionado (sem a extensão .csv)
        const expectedFileName = typeFile.replace('.csv', '');
        if (!fileInfo.name.startsWith(expectedFileName)) {
            toast.error(`O nome do arquivo deve começar com "${expectedFileName}"`);
            setLoader(false);
            return;
        }

        setLoader(true);

        const formData = new FormData();
        formData.append('file', new Blob([Papa.unparse(csvData)], { type: 'text/csv' }), fileInfo.name);

        await axios.post('https://tecsus-etl-2.onrender.com/upload', formData)
            .then(function (response) {
                setLoader(false);
                toast.success('Atualizado com sucesso!');
            })
            .catch(function (error) {
                setLoader(false);
                toast.error('Falha ao executar a atualização!');
            });
    }

    function handleSelectChange(e) {
        setFileInfo(null);
        setCsvData(null);
        setFileActivate(null);
        setTypeFile(e.target.value);
    }

    const handleFileRead = (event) => {
        const file = event.target.files[0];
        setFileInfo(file);

        Papa.parse(file, {
            complete: (results) => {
                setCsvData(results.data);
                setFileActivate(true);
                toast.success('Arquivo lido com sucesso!');
            },
            error: () => {
                setFileActivate(false);
                toast.error('Erro ao ler o arquivo!');
            }
        });
    };

    return (
        <div className='upload'>
            {loader && <Loader />}
            <Sidebar />
            <main className='page-container'>
                <Title name={"Atualizar Dados"}>
                    <GrDocumentCsv size={25} />
                </Title>
                <form className='form-upload' onSubmit={(e) => { e.preventDefault(); upload(); }}>
                    <div className='group-select'>
                        <h4>Selecione o tipo</h4>
                        <select value={typeFile} onChange={handleSelectChange}>
                            <option value={"con_agua.csv"}>con_agua</option>
                            <option value={"pro_agua.csv"}>pro_agua</option>
                            <option value={"con_energia.csv"}>con_energia</option>
                            <option value={"pro_energia.csv"}>pro_energia</option>
                        </select>
                    </div>
                    <div className='group-input'>
                        <label htmlFor="fileInput">Selecione o arquivo atualizado</label>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".csv"
                            onChange={handleFileRead}
                        />
                        <button type="submit" className='upload-button'>Upload</button>
                    </div>
                </form>
            </main>
        </div>
    );
}
