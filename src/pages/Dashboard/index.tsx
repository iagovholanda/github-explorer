import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [ínputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    /* Retornando informações do local storage. */
    const storageRepositories = localStorage.getItem(
      'GithubExplorer:repositories',
    );

    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }
    return [];
  });

  /* Salvando as informações dentro do local storage. */
  useEffect(() => {
    localStorage.setItem(
      'GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  /*
    FormEvent: Representa o evento de submit do formulário.
    HTMLFormElement: Representa o elemento HTML do form.
  */

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    /* Caso seja realizada uma requisição sem passar nenhum valor, um error é retornado. */
    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório. ');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      /* Retornando todos os dados do repositorio. */
      const repository = response.data;

      setRepositories([...repositories, repository]);
      /* Limpando o input. */
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositório. ');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explore" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={Boolean(ínputError)} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {ínputError && <Error>{ínputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
