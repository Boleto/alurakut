import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  //console.log(propriedades);
  return (
    <Box>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
              {propriedades.title} ({propriedades.items.length})
          </h2>
          <ul>
          {propriedades.items.slice(0, 6).map((itemAtual) => {
          return (
                <li key={itemAtual.id}>
                  <a href={`https://github.com/${itemAtual.login}`}>
                    <img src={itemAtual.avatar_url} />
                    <span>{itemAtual.login}</span>
                  </a>
                </li>
              );
            })}
          </ul>

      {propriedades.items.length > 6 ? <a href="#">Ver mais</a> : ""}
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home() {
  const [comunidades, setComunidades] = React.useState([
    {
      id: 31231231211,
      title: 'Eu odeio acordar cedo',
      imageUrl: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
      url: 'https://www.orkut.br.com/MainCommunity?cmm=10000'
    },
    {
      id: 1234,
      title: 'Lênin de 3',
      imageUrl: 'https://yt3.ggpht.com/ytc/AKedOLRammDRJ_B37UUtn7YeUzQy2UeEYm4sCH6xzLAmtw=s176-c-k-c0x00ffffff-no-rj-mo',
      url: 'https://www.orkut.br.com/MainCommunity?cmm=18453'
  }]);
 
  const usuarioAleatorio = 'boleto';
  const pessoasFavoritas = [
    'juunegreiros',
    'peas',
    'professorbossini',
    'rafaballerini'
  ]

  
  const [seguidores, setSeguidores] = React.useState([]);

   React.useEffect(function() {
     fetch('https://api.github.com/users/boleto/followers')
      .then(function (respostadoservidor) {
        return respostadoservidor.json();
    })
      .then(function(respostaCompleta){
        setSeguidores(respostaCompleta);
    })

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'ebaa570a38b4838879d7031c6e467f',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify ({
        'query': `query {
          allCommunities{
            title
            id
            imageUrl
            url
            slugCreator
          }
        }`})
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })
    // .then(function (response) {
    //   return response.json()
    // })

  }, [])


  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a), {usuarioAleatorio}
            </h1>

            <OrkutNostalgicIconSet fas="1" sexy="1"/>
          </Box>

          <Box>
            <h2 className="subTitle">Crie sua comunidade</h2>
            <hr />
            <form onSubmit={function handleCriarComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                url: dadosDoForm.get('url'),
                slug_creator: usuarioAleatorio,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                //console.log(dados)
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade]
                setComunidades(comunidadesAtualizadas)
              })


            }}>
              <div>
              <input
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title"
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
              </div>
              <div>
              <input
                placeholder="Coloque uma URL para usarmos de capa"
                name="image"
                aria-label="Coloque uma URL para usarmos de capa"
                type="text"
              />
              </div>
              <div>
              <input
                placeholder="Insira o link da sua comunidade"
                name="url"
                aria-label="Insira o link da sua comunidade"
                type="text"
              />
              </div>

              <button>
                Criar comunidade
              </button>

            </form>

           
          </Box>

        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
          <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                     <a href={`${itemAtual.url}`}>
                      <img src={itemAtual.imageUrl} /> 
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`https://github.com/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
