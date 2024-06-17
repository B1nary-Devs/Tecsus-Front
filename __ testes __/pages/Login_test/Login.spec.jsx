import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; // Se você estiver usando react-router
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';
import Login from '../../../src/pages/Login'


// MOCK REACT TOASTIFY
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

// MOCK DE ROUTER DOM
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), 
    useNavigate: jest.fn(),
}));

// SIMULANDO A FUNÇÃO DE NAVEGAÇÃO DE PÁGINA (NAVIGATE)
const mockNavigate = jest.fn();
useNavigate.mockImplementation(() => mockNavigate);


// SUITE A SEGUIR IRÁ PERCORRER A COLEÇÃO DE TESTES UNITÁRIOS PERTENCENTES A PÁGINA DE AUTENTICAÇÃO
describe('SUITE DE TESTES DA FUNCAO LOGIN', () => {

    beforeEach(() => {
        render(<Router><Login /></Router>);
    });



    /* O TESTE A SEGUIR EXBIRÁ UM ALERTA AO USUÁRIO SOBRE A OBRIGATORIEDADE DE PREENCHER OS CAMPOS,
    CASO USUÁRIO APENAS CLIQUE NO BOTÃO DE LOGIN SEM PREENCHER O FORMULÁRIO */

    it('isNull_fieldsNull_Expect_toastErrorFieldsNull', () => {

        // CAPTURANDO O BOTÃO
        const buttonLogin = screen.getByTestId('buttonLogin');

        // DISPARANDO A FUNÇÃO CLICK
        fireEvent.click(buttonLogin);

        // RETORNANDO TOAST COM MESSAGEM DE ALERTA
        expect(toast.error).toHaveBeenCalledWith('Preencha os campos vazios!');

    });

});
