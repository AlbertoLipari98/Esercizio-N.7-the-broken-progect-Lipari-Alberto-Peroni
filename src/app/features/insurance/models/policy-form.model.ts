export interface PolicyFormData {
  nome: string;
  cognome: string;
  dataNascita: string;
  codiceFiscale: string;
  beneficiari: Beneficiario[];
  pin: string;
  confermaPin: string;
}

export interface Beneficiario {
  nome: string;
  cognome: string;
  cf: string;
  percentuale: number;
}
