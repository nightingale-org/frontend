type A = {
  first_name: string;
} & (
  | {
      accessToken: string;
      ctx?: never;
    }
  | {
      accessToken?: never;
      ctx: { a: number };
    }
  | {
      accessToken?: never;
      ctx?: never;
    }
);

const b: A = {
  first_name: 'Hlib',
  accessToken: 'helloWorld'
};

const b1: A = {
  first_name: 'Hlib',
};

const b2: A = {
  first_name: 'Hlib'
};
