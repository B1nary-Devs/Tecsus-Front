import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Papa from 'papaparse';
import UploadFile from '../../../src/pages/UploadFile/index';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

// Mocking the dependencies
jest.mock('axios');
jest.mock('papaparse');
jest.mock('react-toastify', () => ({
  toast: {
    warning: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Componente UploadFile', () => {
  beforeEach(() => {
    axios.post.mockClear();
    Papa.parse.mockClear();
    jest.clearAllMocks();
  });

  it('deve lidar com a seleção de arquivos e processo de upload', async () => {
    // Mock o processo de análise de CSV
    const mockParse = Papa.parse.mockImplementation((file, options) => {
      options.complete({ data: [['coluna1', 'coluna2'], ['valor1', 'valor2']] });
    });

    // Mock a solicitação de postagem do axios
    axios.post.mockResolvedValue({ data: 'success' });

    // Renderiza o componente
    const { getByText, getByLabelText, getByRole } = render(
      <BrowserRouter>
        <UploadFile />
      </BrowserRouter>
    );

    // Simula a seleção do tipo de arquivo
    fireEvent.change(getByRole('combobox'), { target: { value: 'con_agua.csv' } });

    // Simula seleção de arquivo
    const file = new Blob(['coluna1,coluna2\nvalor1,valor2'], { type: 'text/csv' });
    const fileInput = getByLabelText('Selecione o arquivo atualizado');
    fireEvent.change(fileInput, { target: { files: [new File([file], 'con_agua.csv', { type: 'text/csv' })] } });

    // Certifica que o arquivo foi lido com sucesso
    await waitFor(() => expect(Papa.parse).toHaveBeenCalled());

    // Simula clicar no botão de upload
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);

    // Certifica que a solicitação de postagem do axios foi feita
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('https://tecsus-etl-2.onrender.com/upload', expect.any(FormData)));
  });

  it('deve exibir um aviso ao tentar fazer upload sem selecionar um arquivo', async () => {
    // Renderiza o componente
    const { getByText } = render(
      <BrowserRouter>
        <UploadFile />
      </BrowserRouter>
    );

    // Simula clicar no botão de upload sem selecionar um arquivo
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);

    // Certifica que o alerta de aviso foi exibido
    await waitFor(() => expect(toast.warning).toHaveBeenCalledWith('Por favor, carregue um arquivo antes de fazer o upload'));
  });

  it('deve exibir erro quando o nome do arquivo não corresponde ao tipo selecionado', async () => {
    // Renderiza o componente
    const { getByText, getByLabelText, getByRole } = render(
      <BrowserRouter>
        <UploadFile />
      </BrowserRouter>
    );

    // Simula a seleção do tipo de arquivo
    fireEvent.change(getByRole('combobox'), { target: { value: 'con_agua.csv' } });

    // Simule a seleção de um arquivo com um nome diferente
    const file = new Blob(['coluna1,coluna2\nvalor1,valor2'], { type: 'text/csv' });
    const fileInput = getByLabelText('Selecione o arquivo atualizado');
    fireEvent.change(fileInput, { target: { files: [new File([file], 'nome_errado.csv', { type: 'text/csv' })] } });

    // Simula clicar no botão de upload
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);

    // Certifica que o brinde de erro foi exibido
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('O nome do arquivo deve começar com "con_agua"'));
  });

  it('deve exibir erro quando o upload falha', async () => {

    // Mock a postagem do axios para rejeitar
    axios.post.mockRejectedValue(new Error('Upload falhou'));

    // Render the component
    const { getByText, getByLabelText, getByRole } = render(
      <BrowserRouter>
        <UploadFile />
      </BrowserRouter>
    );

    // Renderiza o componente
    fireEvent.change(getByRole('combobox'), { target: { value: 'con_agua.csv' } });

    // Simula seleção de arquivo
    const file = new Blob(['coluna1,coluna2\nvalor1,valor2'], { type: 'text/csv' });
    const fileInput = getByLabelText('Selecione o arquivo atualizado');
    fireEvent.change(fileInput, { target: { files: [new File([file], 'con_agua.csv', { type: 'text/csv' })] } });

    // Simula clicar no botão de upload
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);

    // Certifica que o brinde de erro foi exibido
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Falha ao executar a atualização!'));
  });
});

