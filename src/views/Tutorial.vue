<template>
  <Layout>
    <v-row class="d-flex align-center justify-center mt-8">
      <v-col cols="auto">
        <h2>Passo a passo para criar seu primeiro Gerador!</h2>
        <p class="text-subtitle-1">Nesse tutorial você irá aprender a criar um gerador procedural de imagens compostas por um tilemap cadastrado.</p>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          variant="flat"
          color="primary"
          role="link"
          prepend-icon="mdi mdi-earth-box-plus"
          to="/novo"
        >
          Criar Novo Gerador
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="d-flex align-center justify-center">
      <v-col cols="auto">
        <v-sheet
          border="md"
          class="py-6 px-4 mx-auto"
          max-width="600"
          rounded
        >
          <dl class="pl-5">
            <dt>Tilemap</dt>
            <dd>
              Escolha um tilemap de sua preferência. Você pode criar um novo ou escolher um dos exemplos disponíveis: <a href="#" download>snake</a>, <a href="#" download>esgoto</a> ou <a href="#" download>mario</a>.
            </dd>
            <dt>Gerador</dt>
            <dd>Na <a href="/">página inicial</a> clique em "Criar Novo Gerador" e você irá para a tela de cadastro de tiles. Nessa etapa você precisa que cadastrar o nome do tilemap, tamanho dos tiles (em pixel), altura/largura da imagem gerada e se as variações dos tiles são "únicas" ou não.</dd>
            <dt>Tiles</dt>
            <dd>Ainda na etapa de cadastro dos tiles, clique em "+" para adicionar tiles ao tilemap. Em cada tile informe nome, simetria e peso. Além disso, Faça upload da imagem do tile (ou das variações, caso seja "único"). Após finalizar o cadastro dos tiles clique em "Definir Adjacências" para avançar para a última etapa do cadastro.</dd>
            <dt>Adjacências</dt>
            <dd>Para cadastrar as adjacências simplesmente clique em "+" e defina quem é o vizinho da direita e o da esquerda. Use a vizualização para comparar se os vizinhos se "encaixam". Alternativamente, você pode clicar em "Preencher Adjacências Automaticamente" para agilizar parte do cadastro, no entanto, caso escolha essa opção, é importante revisar se há vizinhos que gostaria de adicionar ou remover.</dd>
            <dt>Procedural</dt>
            <dd>Na <a href="/">página inicial</a> temos a listagem de todos os geradores cadastrados no sistema. Para cada um deles, clique na opção "gerar" para inicia a geração procedural de uma nova imagem</dd>
            <dt>Sua Opinião</dt>
            <dd>Ao fim do uso do sistema, por gentileza, dê sua opinião sobre a usabilidade e experiência de usuário clicando nos botões abaixo <i class="mdi mdi-hand-pointing-down"></i>.</dd>
          </dl>
          <v-btn
            block
            class="text-none text-black"
            color="primary"
            variant="outlined"
            href="#"
          >
            Opine sobre a usabilidade do sistema
          </v-btn>
          <v-btn
            block
            class="text-none text-black mt-4"
            color="primary"
            variant="flat"
            href="#"
          >
            Opine sobre a UX do sistema
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </Layout>
</template>

<script setup>
  import Layout from '@/components/Layout.vue'
</script>

<style scoped lang="scss">
dl {
  counter-reset: count;
	margin: 0;
	padding-right: 4vw;
  padding-top: 3vw;
  padding-bottom: 3vw;
  padding-left: 2vw;	
}
dl + dl {
	counter-reset: counter 4;
}
dt {
  counter-increment: count;
	color: #4f6d7aff;
	font-size: 1.6rem;
	text-transform: uppercase;
}
dt::before {
  content: counter(count, decimal-leading-zero)".";
	color: #5ea5b8ff;
	margin-left: -1vw;
	padding-right: 12px;
}

dd {
	margin-left: 2vw;
	margin-bottom: 2vh;
}
</style>