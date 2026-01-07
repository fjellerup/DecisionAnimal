export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export interface Translations {
  title: string;
  subtitle: string;
  askButton: string;
  deciding: string;
  result: string;
  disclaimer: string;
  settings: string;
  language: string;
  animal: string;
  spinDuration: string;
  fast: string;
  slow: string;
  decisions: string;
  addDecision: string;
  edit: string;
  delete: string;
  reset: string;
  text: string;
  color: string;
  buttonColor: string;
  confetti: string;
  save: string;
  cancel: string;
}

export const translations: { [lang: string]: Translations } = {
  en: {
    title: 'Decision {animal}',
    subtitle: 'Let the {animal} decide your fate',
    askButton: 'Ask the {animal}',
    deciding: 'Deciding...',
    result: 'The {animal} says:',
    disclaimer: '* 100% accurate according to {animal} logic *',
    settings: 'Settings',
    language: 'Language',
    animal: 'Animal',
    spinDuration: 'Spin Duration',
    fast: 'Fast',
    slow: 'Slow',
    decisions: 'Decisions',
    addDecision: 'Add Decision',
    edit: 'Edit',
    delete: 'Delete',
    reset: 'Reset All',
    text: 'Text',
    color: 'Color',
    buttonColor: 'Button Color',
    confetti: 'Confetti',
    save: 'Save',
    cancel: 'Cancel',
  },
  da: {
    title: 'Beslutnings {animal}',
    subtitle: 'Lad {animalDef} bestemme din skæbne',
    askButton: 'Spørg {animalDef}',
    deciding: 'Tænker...',
    result: '{animalDef} siger:',
    disclaimer: '* 100% præcis ifølge {animal} logik *',
    settings: 'Indstillinger',
    language: 'Sprog',
    animal: 'Dyr',
    spinDuration: 'Spin Varighed',
    fast: 'Hurtig',
    slow: 'Langsom',
    decisions: 'Beslutninger',
    addDecision: 'Tilføj Beslutning',
    edit: 'Rediger',
    delete: 'Slet',
    reset: 'Nulstil Alt',
    text: 'Tekst',
    color: 'Farve',
    buttonColor: 'Knap Farve',
    confetti: 'Konfetti',
    save: 'Gem',
    cancel: 'Annuller',
  },
  de: {
    title: 'Entscheidungs {animal}',
    subtitle: 'Lass das {animal} dein Schicksal entscheiden',
    askButton: 'Frag das {animal}',
    deciding: 'Überlegt...',
    result: 'Das {animal} sagt:',
    disclaimer: '* 100% genau nach {animal}-Logik *',
    settings: 'Einstellungen',
    language: 'Sprache',
    animal: 'Tier',
    spinDuration: 'Spin Dauer',
    fast: 'Schnell',
    slow: 'Langsam',
    decisions: 'Entscheidungen',
    addDecision: 'Entscheidung Hinzufügen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    reset: 'Alles Zurücksetzen',
    text: 'Text',
    color: 'Farbe',
    buttonColor: 'Knopf Farbe',
    confetti: 'Konfetti',
    save: 'Speichern',
    cancel: 'Abbrechen',
  },
  es: {
    title: '{animal} de Decisión',
    subtitle: 'Deja que el {animal} decida tu destino',
    askButton: 'Pregunta al {animal}',
    deciding: 'Decidiendo...',
    result: 'El {animal} dice:',
    disclaimer: '* 100% preciso según la lógica del {animal} *',
    settings: 'Ajustes',
    language: 'Idioma',
    animal: 'Animal',
    spinDuration: 'Duración del Giro',
    fast: 'Rápido',
    slow: 'Lento',
    decisions: 'Decisiones',
    addDecision: 'Añadir Decisión',
    edit: 'Editar',
    delete: 'Eliminar',
    reset: 'Restablecer Todo',
    text: 'Texto',
    color: 'Color',
    buttonColor: 'Color del Botón',
    confetti: 'Confeti',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
};

export function t(
  key: keyof Translations,
  lang: string,
  animalName: string,
  animalDefiniteName?: string
): string {
  const text = translations[lang]?.[key] || translations['en'][key];
  const definiteName = animalDefiniteName || animalName;
  return text
    .replace(/{animalDef}/g, definiteName)
    .replace(/{animal}/g, animalName);
}
