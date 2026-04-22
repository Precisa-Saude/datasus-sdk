/**
 * Tabela NAT_JUR — natureza jurídica, código IBGE de 4 dígitos.
 *
 * A tabela oficial tem ~1000 códigos; aqui cobrimos os mais frequentes
 * em estabelecimentos CNES (administração pública federal/estadual/
 * municipal, empresas privadas, OS, filantrópicas, fundações).
 *
 * Códigos não mapeados retornam `null` — o chamador pode exibir o
 * código cru como fallback.
 */

const LABELS: Record<string, string> = {
  // Administração pública
  '1015': 'Órgão Público do Poder Executivo Federal',
  '1023': 'Órgão Público do Poder Executivo Estadual ou do DF',
  '1031': 'Órgão Público do Poder Executivo Municipal',
  '1040': 'Órgão Público do Poder Legislativo Federal',
  '1058': 'Órgão Público do Poder Legislativo Estadual ou do DF',
  '1066': 'Órgão Público do Poder Legislativo Municipal',
  '1074': 'Órgão Público do Poder Judiciário Federal',
  '1082': 'Órgão Público do Poder Judiciário Estadual',
  '1104': 'Autarquia Federal',
  '1112': 'Autarquia Estadual ou do DF',
  '1120': 'Autarquia Municipal',
  '1139': 'Fundação Pública Federal',
  '1147': 'Fundação Pública Estadual ou do DF',
  '1155': 'Fundação Pública Municipal',
  '1163': 'Órgão Público Autônomo Federal',
  '1171': 'Órgão Público Autônomo Estadual ou do DF',
  '1180': 'Órgão Público Autônomo Municipal',
  '1198': 'Comissão Polinacional',
  '1201': 'Consórcio Público de Direito Público (Associação Pública)',
  '1210': 'Consórcio Público de Direito Privado',
  '1228': 'Estado ou Distrito Federal',
  '1236': 'Município',
  '1244': 'Município (administração direta)',
  '1252': 'União',

  // Empresas
  '2011': 'Empresa Pública',
  '2038': 'Sociedade de Economia Mista',
  '2046': 'Sociedade Anônima Aberta',
  '2054': 'Sociedade Anônima Fechada',
  '2062': 'Sociedade Empresária Limitada',
  '2070': 'Sociedade Empresária em Nome Coletivo',
  '2089': 'Sociedade Empresária em Comandita Simples',
  '2097': 'Sociedade Empresária em Comandita por Ações',
  '2127': 'Sociedade em Conta de Participação',
  '2135': 'Empresário (Individual)',
  '2143': 'Cooperativa',
  '2151': 'Consórcio de Sociedades',
  '2160': 'Grupo de Sociedades',
  '2178': 'Estabelecimento, no Brasil, de Sociedade Estrangeira',
  '2216': 'Empresa Domiciliada no Exterior',
  '2224': 'Clube/Fundo de Investimento',
  '2232': 'Sociedade Simples Pura',
  '2240': 'Sociedade Simples Limitada',
  '2259': 'Sociedade Simples em Nome Coletivo',
  '2267': 'Sociedade Simples em Comandita Simples',
  '2305': 'Empresa Binacional',
  '2313': 'Consórcio de Empregadores',
  '2321': 'Consórcio Simples',
  '2330': 'Empresa Individual de Responsabilidade Limitada (EIRELI) — natureza empresária',
  '2348': 'Empresa Individual de Responsabilidade Limitada (EIRELI) — natureza simples',

  // Entidades sem fins lucrativos
  '3034': 'Serviço Notarial e Registral (Cartório)',
  '3069': 'Fundação Privada',
  '3077': 'Serviço Social Autônomo',
  '3085': 'Condomínio Edilício',
  '3107': 'Comissão de Conciliação Prévia',
  '3115': 'Entidade de Mediação e Arbitragem',
  '3131': 'Entidade Sindical',
  '3204': 'Estabelecimento, no Brasil, de Fundação ou Associação Estrangeiras',
  '3212': 'Fundação ou Associação Domiciliada no Exterior',
  '3220': 'Organização Religiosa',
  '3239': 'Comunidade Indígena',
  '3247': 'Fundo Público',
  '3271': 'Organização Social (OS)',
  '3280': 'OSCIP — Organização da Sociedade Civil de Interesse Público',
  '3999': 'Associação Privada',

  // Pessoas físicas
  '4014': 'Pessoa Física',
  '4022': 'Candidato a Cargo Político Eletivo',
  '4030': 'Leiloeiro',
};

/** Busca o rótulo da natureza jurídica; retorna null pra códigos não cobertos. */
export function labelNaturezaJuridica(code: null | string | undefined): null | string {
  if (!code) return null;
  return LABELS[String(code).trim().padStart(4, '0')] ?? null;
}
