# 📊 Configuração de Analytics - Guia Completo

## 🎯 Visão Geral

Este portfólio inclui um sistema completo de analytics com múltiplas ferramentas de rastreamento e um dashboard interativo em tempo real.

## 🛠️ Configuração Inicial

### 1. Google Analytics 4 (GA4)

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma nova propriedade GA4
3. Copie o Measurement ID (formato: `G-XXXXXXXXXX`)
4. Edite o arquivo `analytics-config.js`
5. Substitua `G-XXXXXXXXXX` pelo seu ID:

```javascript
GA4: {
    MEASUREMENT_ID: 'G-SEU_ID_AQUI',
    ENABLED: true,
    // ...
}
```

### 2. Hotjar (Opcional)

1. Acesse [Hotjar](https://www.hotjar.com/)
2. Crie uma nova conta ou faça login
3. Adicione um novo site
4. Copie o Site ID
5. Atualize a configuração:

```javascript
HOTJAR: {
    ENABLED: true,
    SITE_ID: 'SEU_ID_HOTJAR'
}
```

### 3. Microsoft Clarity (Opcional)

1. Acesse [Microsoft Clarity](https://clarity.microsoft.com/)
2. Faça login com sua conta Microsoft
3. Crie um novo projeto
4. Copie o Project ID
5. Configure no arquivo:

```javascript
CLARITY: {
    ENABLED: true,
    PROJECT_ID: 'SEU_ID_CLARITY'
}
```

### 4. Meta Pixel (Opcional)

1. Acesse [Meta Business Suite](https://business.facebook.com/)
2. Vá para Data Sources > Pixels
3. Crie um novo pixel
4. Copie o Pixel ID
5. Atualize a configuração:

```javascript
META_PIXEL: {
    ENABLED: true,
    PIXEL_ID: 'SEU_ID_PIXEL'
}
```

### 5. LinkedIn Insight Tag (Opcional)

1. Acesse [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager/)
2. Vá para Account Assets > Insight Tag
3. Copie o Partner ID
4. Configure:

```javascript
LINKEDIN: {
    ENABLED: true,
    PARTNER_ID: 'SEU_ID_LINKEDIN'
}
```

## 🚀 Ativação Rápida

### Método 1: Configuração Manual

Edite o arquivo `analytics-config.js` e substitua os IDs placeholder:

```javascript
const ANALYTICS_CONFIG = {
    GA4: {
        MEASUREMENT_ID: 'G-XXXXXXXXXX', // ← Substitua aqui
        ENABLED: true,
        // ...
    },
    HOTJAR: {
        ENABLED: true,
        SITE_ID: 'XXXXXXXXXX', // ← Substitua aqui
        // ...
    },
    // ...
};
```

### Método 2: Configuração Programática

Use a função global para configurar dinamicamente:

```javascript
// Configure apenas GA4
configureAnalytics({
    GA4: { MEASUREMENT_ID: 'G-SEU_ID' }
});

// Configure múltiplas ferramentas
configureAnalytics({
    GA4: { 
        MEASUREMENT_ID: 'G-SEU_ID',
        ENABLED: true 
    },
    HOTJAR: { 
        SITE_ID: 'SEU_ID_HOTJAR',
        ENABLED: true 
    }
});
```

## 📊 Dashboard de Analytics

### Acesso ao Dashboard

- **Atalho**: `Ctrl + Shift + A`
- **Botão flutuante**: Ícone de gráfico no canto inferior direito
- **Menu**: Configurações > Dashboard Analytics

### Funcionalidades do Dashboard

#### 📈 Métricas em Tempo Real
- Visitantes ativos
- Visualizações da página
- Duração média da sessão
- Taxa de rejeição
- Feed de eventos em tempo real

#### 📱 Análise de Dispositivos
- Distribuição Desktop/Mobile/Tablet
- Barras de progresso visuais
- Percentuais detalhados

#### 🏆 Páginas Mais Visitadas
- Top 5 páginas mais acessadas
- Contador de visualizações
- URLs das páginas
- Ranking dinâmico

#### ⚡ Métricas de Performance
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Status de saúde (bom/melhorar/ruim)

#### 📤 Exportação de Dados
- Exportar em formato CSV
- Exportar em formato JSON
- Exportar em formato HTML/PDF
- Dados completos com timestamp

## 🎯 Eventos Rastreados Automaticamente

### Navegação
- `page_view` - Visualização de página
- `scroll_depth` - Profundidade de scroll
- `time_on_page` - Tempo na página

### Interação do Usuário
- `outbound_click` - Cliques em links externos
- `form_submission` - Envio de formulários
- `download_click` - Downloads
- `search_query` - Buscas realizadas

### Engajamento
- `engagement_paused` - Usuário inativo
- `engagement_resumed` - Usuário ativo novamente

### Performance
- `performance_metrics` - Core Web Vitals
- `javascript_error` - Erros JavaScript
- `promise_rejection` - Rejeições de Promise

## 🔧 Configurações Avançadas

### Privacidade e Compliance

```javascript
PRIVACY: {
    RESPECT_DO_NOT_TRACK: true,    // Respeita preferência do usuário
    ANONYMIZE_IP: false,         // Não anonimiza IP
    COOKIE_CONSENT: true,          // Requer consentimento
    GDPR_COMPLIANT: true          // Conforme com GDPR
}
```

### Storage Local

```javascript
LOCAL_STORAGE: {
    ENABLED: true,                // Ativa backup local
    PREFIX: 'portfolio_analytics_', // Prefixo das chaves
    MAX_EVENTS: 100,             // Máximo de eventos salvos
    SESSION_TIMEOUT: 1800000       // Timeout da sessão (30min)
}
```

### Performance Tracking

```javascript
PERFORMANCE: {
    ENABLED: true,                // Ativa rastreamento
    CORE_WEB_VITALS: true,       // Métricas principais
    RESOURCE_TIMING: true,         // Timing de recursos
    USER_TIMING: true             // Timing de interações
}
```

## 📱 Integração com Outras Ferramentas

### Google Tag Manager (GTM)

Se você usa GTM, pode integrar com o portfólio:

```javascript
// No GTM, crie variáveis:
// - {{GA4_MEASUREMENT_ID}}
// - {{HOTJAR_SITE_ID}}
// - {{CLARITY_PROJECT_ID}}

// E dispare os tags correspondentes
```

### Segment

```javascript
// Configure endpoint customizado
CUSTOM_ENDPOINT: {
    ENABLED: true,
    URL: 'https://api.segment.io/v1/track',
    HEADERS: {
        'Authorization': 'Bearer SEU_TOKEN_SEGMENT'
    }
}
```

## 🔍 Debug e Testes

### Modo Debug

Ative o modo debug para testar:

```javascript
// Em analytics-config.js
GA4: {
    MEASUREMENT_ID: 'G-SEU_ID',
    DEBUG: true  // ← Ativa debug
}
```

### Verificação no Console

```javascript
// Ver configuração atual
console.table(getAnalyticsConfig());

// Ver eventos sendo disparados
window.trackAnalytics = (eventName, params) => {
    console.log('Analytics Event:', eventName, params);
    // ... resto do código
};
```

### Teste de Eventos

```javascript
// Dispare eventos de teste
window.trackAnalytics('test_event', {
    category: 'Testing',
    label: 'Manual Test',
    value: 1
});
```

## 📊 Relatórios e Insights

### Google Analytics

Acesse os relatórios em:
- [Realtime](https://analytics.google.com/analytics/web/#/realtime-report)
- [Acquisition](https://analytics.google.com/analytics/web/#/acquisition-report)
- [Behavior](https://analytics.google.com/analytics/web/#/behavior-report)
- [Conversions](https://analytics.google.com/analytics/web/#/conversions-report)

### Hotjar

- Recordings de sessão
- Mapas de calor
- Funnels de conversão
- Feedback de usuários

### Microsoft Clarity

- Mapas de calor
- Session recordings
- Dashboard de uso
- Análise de funil

## 🚨 Solução de Problemas

### Eventos Não Aparecendo

1. Verifique se os IDs estão corretos
2. Confirme que `ENABLED: true` para as ferramentas
3. Verifique o console para erros
4. Teste com o modo debug ativado

### Problemas de Privacidade

1. Verifique as configurações de consentimento
2. Confirme se está respeitando Do Not Track
3. Verifique as leis de privacidade locais

### Performance Lenta

1. Desative ferramentas não essenciais
2. Otimize o carregamento dos scripts
3. Use carregamento assíncrono onde possível

## 📚 Documentação Adicional

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [Hotjar Documentation](https://help.hotjar.com/hc/en-us)
- [Microsoft Clarity Documentation](https://learn.microsoft.com/en-us/clarity/)
- [Meta Pixel Documentation](https://developers.facebook.com/docs/marketing-api/facebook-pixel)
- [LinkedIn Insight Tag Documentation](https://www.linkedin.com/help/linkedin/answer/a524417)

## 🎉 Suporte

Para dúvidias ou problemas:

1. Verifique o console do navegador para erros
2. Consulte a documentação oficial das ferramentas
3. Teste em diferentes navegadores
4. Verifique as configurações de firewall/antivírus

---

**⭐ Se este guia foi útil, considere dar uma estrela ao projeto!**
