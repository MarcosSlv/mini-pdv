# Sistema PDV - Frontend

Sistema de Ponto de Venda (PDV) desenvolvido em React com interface moderna e responsiva.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca principal para construção da interface
- **React Router DOM** - Gerenciamento de rotas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados e schemas
- **Axios** - Cliente HTTP para comunicação com a API
- **Tailwind CSS** - Framework CSS para estilização
- **Lucide React** - Biblioteca de ícones
- **React Toastify** - Notificações toast
- **Vite** - Build tool e desenvolvimento

## 📋 Funcionalidades

### Dashboard
- Métricas em tempo real do sistema
- Total de produtos cadastrados
- Vendas do dia
- Faturamento diário
- Produtos com estoque baixo

### Gerenciamento de Produtos
- ✅ Listagem de produtos com filtros
- ✅ Cadastro de novos produtos
- ✅ Edição de produtos existentes
- ✅ Exclusão de produtos
- ✅ Busca por nome ou código de barras
- ✅ Filtro por categoria
- ✅ Validação completa com Zod

### PDV (Ponto de Venda)
- ✅ Adição de produtos ao carrinho via código de barras
- ✅ Busca visual de produtos
- ✅ Gestão de quantidades no carrinho
- ✅ Seleção de forma de pagamento
- ✅ Finalização de vendas
- ✅ Controle de estoque em tempo real

### Relatórios
- ✅ Listagem de todas as vendas
- ✅ Filtros por data e forma de pagamento
- ✅ Métricas de vendas e faturamento
- ✅ Cálculo de ticket médio

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend do sistema rodando na porta 3000

### Instalação
```bash
cd frontend
npm install
```

### Configuração
O frontend está configurado para se comunicar com o backend em `http://localhost:3000/api`. 
Se necessário, altere a URL base no arquivo `src/services/api.js`.

### Executar em desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface básicos
│   │   ├── Button.jsx  # Componente de botão
│   │   ├── Input.jsx   # Componente de input
│   │   └── Select.jsx  # Componente de select
│   ├── Layout.jsx      # Layout principal com navegação
│   └── ProductForm.jsx # Formulário de produtos
├── pages/              # Páginas principais
│   ├── Dashboard.jsx   # Página inicial com métricas
│   ├── Products.jsx    # Gerenciamento de produtos
│   ├── PDV.jsx        # Ponto de venda
│   └── Reports.jsx    # Relatórios de vendas
├── services/           # Serviços de comunicação com API
│   ├── api.js         # Configuração base do Axios
│   ├── productService.js # Serviços de produtos
│   └── saleService.js    # Serviços de vendas
├── schemas/            # Schemas de validação Zod
│   ├── productSchemas.js # Validações de produtos
│   └── saleSchemas.js   # Validações de vendas
├── hooks/              # Hooks personalizados
│   └── useToast.js    # Hook para notificações
├── App.jsx            # Componente principal
└── main.jsx          # Ponto de entrada
```

## 🎨 Design System

### Cores
- **Primária**: Azul (#2563eb)
- **Sucesso**: Verde (#16a34a)
- **Erro**: Vermelho (#dc2626)
- **Aviso**: Amarelo (#eab308)

### Componentes
Todos os componentes seguem padrões consistentes:
- Estados de loading
- Validação de formulários
- Feedback visual para ações
- Responsividade mobile-first

## 🔄 Integração com Backend

### Endpoints Utilizados

#### Produtos
- `GET /api/product` - Lista todos os produtos
- `GET /api/product/:barcode` - Busca produto por código
- `POST /api/product` - Cria novo produto
- `PUT /api/product/:id` - Atualiza produto
- `DELETE /api/product/:id` - Remove produto
- `GET /api/product/search` - Busca produtos com filtros

#### Vendas
- `POST /api/sales` - Cria nova venda
- `GET /api/sales` - Lista vendas com filtros
- `GET /api/sales/:id` - Busca venda específica
- `GET /api/sales/daily` - Relatório de vendas do dia

### Validação de Dados
Todos os dados são validados usando Zod antes do envio:

#### Produto
```javascript
{
  name: string (min 2 chars),
  price: number (≥ 0),
  barcode: string (min 3 chars),
  stock: number (≥ 0),
  category: enum ['BEBIDAS', 'ALIMENTOS', 'HIGIENE', 'LIMPEZA', 'OUTROS']
}
```

#### Venda
```javascript
{
  items: [
    {
      barcode: string,
      quantity: number (> 0)
    }
  ],
  paymentMethod: enum ['DINHEIRO', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'PIX']
}
```

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Navegação Mobile
- Menu lateral retrátil
- Botões otimizados para touch
- Cards adaptáveis para telas pequenas

## 🧪 Padrões de Desenvolvimento

### Hooks Personalizados
- `useToast` - Gerenciamento de notificações

### Gerenciamento de Estado
- Estados locais com useState
- useEffect para efeitos colaterais
- Context API quando necessário

### Tratamento de Erros
- Try/catch em todas as chamadas de API
- Mensagens de erro amigáveis
- Estados de loading consistentes

## 🔒 Validação e Segurança

### Validação Frontend
- Validação em tempo real com Zod
- Feedback imediato de erros
- Prevenção de dados inválidos

### Sanitização
- Inputs sanitizados automaticamente
- Validação de tipos de dados
- Prevenção de XSS básico

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Variáveis de Ambiente
Crie um arquivo `.env` para configurações específicas:
```
VITE_API_URL=http://localhost:3000/api
```

## 📈 Performance

### Otimizações Implementadas
- Lazy loading de rotas
- Componentes otimizados com React.memo
- Debounce em buscas
- Paginação em listas grandes

### Métricas de Performance
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

## 🐛 Debugging

### DevTools
- React DevTools para debug de componentes
- Network tab para debug de API calls
- Console logs estratégicos em desenvolvimento

### Logs de Erro
- Erros capturados e exibidos com toast
- Logs detalhados no console (dev only)

## 📚 Próximas Melhorias

- [ ] Implementação de PWA
- [ ] Cache offline com Service Workers
- [ ] Relatórios mais avançados com gráficos
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Sistema de usuários e permissões
- [ ] Backup automático de dados
- [ ] Integração com impressoras térmicas
- [ ] Modo escuro

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ usando React e tecnologias modernas**
