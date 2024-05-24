import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import axios from 'axios';
import { toast } from "react-toastify";
import './upload.css';

import Sidebar from '../../components/sidebar/sidebar';
import Title from '../../components/title/title';
import { GrDocumentCsv } from "react-icons/gr";

export default function UploadFile() {

    const [csvData, setCsvData] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);
    const [fileActivate, setFileActivate] = useState(null);
    const [typeFile, setTypeFile] = useState('con_agua.csv')

    async function upload() {
        if (!csvData || !fileInfo) {
            alert('Por favor, carregue um arquivo antes de fazer o upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', new Blob([csvData], { type: 'text/csv' }), fileInfo.name);

        await axios.post('http://127.0.0.1:8000/upload', formData)

            .then(function (response) {
                toast.success('Atualizado com sucesso!')
            })

            .catch(function (error) {
                toast.error('Falha ao executar a atualização!')
            });
    }

    function handleSelectChange(e) {
        setTypeFile(e.target.value)
    }

    const handleFileUpload = (data, fileInfo) => {
        try {

            setCsvData(data);
            setFileInfo(fileInfo);

            if(fileInfo.name !== typeFile){
                toast.error('Selecione o arquivo correto!')
                setFileActivate(false)
                return
            }

            setFileActivate(true);

        } catch (e) {
            setFileActivate(false);
        }
    };

    return (
        <div className='upload'>
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
                        <label>Selecione o arquivo atualizado</label>
                        <div className='input-box'>
                            {fileInfo ? <h2 className='arq-name'>Arquivo carregado: {fileInfo.name}</h2> : <h2 className='arq-name'></h2>}
                            <CSVReader
                                cssClass={'button-csv'}
                                onFileLoaded={handleFileUpload}
                            />
                        </div>
                        {fileActivate === true && <span style={{ backgroundColor: '#226c22' }} className='label-msg'>Arquivo carregado com sucesso</span>}
                        {fileActivate === false && <span style={{ backgroundColor: '#930000' }} className='label-msg'>Falha ao carregar o arquivo</span>}
                        <button type="submit" className='upload-button'>Upload</button>
                    </div>
                </form>
            </main>
        </div>
    );
}