export interface Animal {
  id: string;
  emoji: string;
  names: {
    [lang: string]: string;
  };
  // Definite form for languages that need it (e.g., Danish: "firbenet" instead of "firben")
  definiteNames?: {
    [lang: string]: string;
  };
  sounds: {
    [lang: string]: string;
  };
}

export const animals: Animal[] = [
  {
    id: 'chicken',
    emoji: '🐥',
    names: {
      en: 'Chicken',
      da: 'Kylling',
      de: 'Huhn',
      es: 'Pollo',
    },
    definiteNames: {
      da: 'Kyllingen',
    },
    sounds: {
      en: 'cluck cluck',
      da: 'kylling',
      de: 'gack gack',
      es: 'clo clo',
    },
  },
  {
    id: 'cow',
    emoji: '🐮',
    names: {
      en: 'Cow',
      da: 'Ko',
      de: 'Kuh',
      es: 'Vaca',
    },
    definiteNames: {
      da: 'Koen',
    },
    sounds: {
      en: 'moo',
      da: 'muh',
      de: 'muh',
      es: 'mu',
    },
  },
  {
    id: 'lizard',
    emoji: '🦎',
    names: {
      en: 'Lizard',
      da: 'Firben',
      de: 'Eidechse',
      es: 'Lagarto',
    },
    definiteNames: {
      da: 'Firbenet',
    },
    sounds: {
      en: 'Lizard',
      da: 'hvæs',
      de: 'zisch',
      es: 'sss',
    },
  },
  {
    id: 'frog',
    emoji: '🐸',
    names: {
      en: 'Frog',
      da: 'Frø',
      de: 'Frosch',
      es: 'Rana',
    },
    definiteNames: {
      da: 'Frøen',
    },
    sounds: {
      en: 'ribbit',
      da: 'kvæk',
      de: 'quak',
      es: 'croac',
    },
  },
  {
    id: 'cat',
    emoji: '🐱',
    names: {
      en: 'Cat',
      da: 'Kat',
      de: 'Katze',
      es: 'Gato',
    },
    definiteNames: {
      da: 'Katten',
    },
    sounds: {
      en: 'meow',
      da: 'mjav',
      de: 'miau',
      es: 'miau',
    },
  },
  {
    id: 'dog',
    emoji: '🐶',
    names: {
      en: 'Dog',
      da: 'Hund',
      de: 'Hund',
      es: 'Perro',
    },
    definiteNames: {
      da: 'Hunden',
    },
    sounds: {
      en: 'woof',
      da: 'vov',
      de: 'wau',
      es: 'guau',
    },
  },
  {
    id: 'pig',
    emoji: '🐷',
    names: {
      en: 'Pig',
      da: 'Gris',
      de: 'Schwein',
      es: 'Cerdo',
    },
    definiteNames: {
      da: 'Grisen',
    },
    sounds: {
      en: 'oink oink',
      da: 'øf øf',
      de: 'oink oink',
      es: 'oinc oinc',
    },
  },
  {
    id: 'shrimp',
    emoji: '🦐',
    names: {
      en: 'Shrimp',
      da: 'Reje',
      de: 'Garnele',
      es: 'Camarón',
    },
    definiteNames: {
      da: 'Rejen',
    },
    sounds: {
      en: 'blub blub',
      da: 'blob blob',
      de: 'blub blub',
      es: 'glub glub',
    },
  },
  {
    id: 'monkey',
    emoji: '🙉',
    names: {
      en: 'Monkey',
      da: 'Abe',
      de: 'Affe',
      es: 'Mono',
    },
    definiteNames: {
      da: 'Aben',
    },
    sounds: {
      en: 'ooh ooh ah ah',
      da: 'uh uh ah ah',
      de: 'uh uh ah ah',
      es: 'uh uh ah ah',
    },
  },
  {
    id: 'fish',
    emoji: '🐟',
    names: {
      en: 'Fish',
      da: 'Fisk',
      de: 'Fisch',
      es: 'Pez',
    },
    definiteNames: {
      da: 'Fisken',
    },
    sounds: {
      en: 'blub blub',
      da: 'blob blob',
      de: 'blub blub',
      es: 'glub glub',
    },
  },
];
