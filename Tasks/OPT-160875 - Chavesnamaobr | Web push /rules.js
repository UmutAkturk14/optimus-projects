// url_mensagem_last_abandoned_url
((Insider.storage.localStorage.get('ins-not-sended-forms-time-opt110287') || {}).envioumensagem || {})
    .lastAbandonedUrl || 'https://www.chavesnamao.com.br/'; /* OPT-111567 */

// url_visita_last_abandoned_url
((Insider.storage.localStorage.get('ins-not-sended-forms-time-opt110287') || {}).agendouvisita || {})
    .lastAbandonedUrl || 'https://www.chavesnamao.com.br/'; /* OPT-111567 */

// url_whatsapp_last_abandoned_url
((Insider.storage.localStorage.get('ins-not-sended-forms-time-opt110287') || {}).envioumensagemwhatsapp || {})
    .lastAbandonedUrl || 'https://www.chavesnamao.com.br/'; /* OPT-111567 */

// url_telefone_last_abandoned_url
((Insider.storage.localStorage.get('ins-not-sended-forms-time-opt110287') || {}).viutelefone || {})
    .lastAbandonedUrl || 'https://www.chavesnamao.com.br/'; /* OPT-111567 */

// url_financiamento_last_aband_url
/* OPT-111567 START */
const getNotSendedFormStorage = Insider.storage.localStorage.get('ins-not-sended-forms-time-opt110287') || {};

(getNotSendedFormStorage.simuloufinanciamento1 || {}).lastAbandonedUrl ||
    (getNotSendedFormStorage.simuloufinanciamento2 || {}).lastAbandonedUrl || 'https://www.chavesnamao.com.br/';
/* OPT-111567 END */
