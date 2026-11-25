// Carga datos de prueba en la base (no borra lo que ya hay)
// Se corre con: node src/seed.js

require("dotenv").config();
const { sequelize, User, Post, Tag, Comment, Post_Images } = require("../models");

async function seed() {
  await sequelize.sync();

  // usuarios
  const nombres = ["Pepe", "Pawlil", "martin", "lucia", "juanchi", "sofi"];
  const usuarios = {};
  for (const nickName of nombres) {
    const [user] = await User.findOrCreate({ where: { nickName } });
    usuarios[nickName] = user;
  }

  // tags
  const nombresTags = ["unahur", "musica", "futbol", "memes", "series", "comida", "viajes", "fotografia", "mascotas", "programacion"];
  const tags = {};
  for (const name of nombresTags) {
    const [tag] = await Tag.findOrCreate({ where: { name } });
    tags[name] = tag;
  }

  // posts
  const posts = [
    {
      user: "sofi",
      description: "Que atardecer por favor, no me quiero volver",
      tags: ["fotografia", "viajes"],
      imagenes: ["https://picsum.photos/id/1016/800/500"],
      comentarios: [
        { user: "lucia", content: "Que linda foto!!" },
        { user: "Pawlil", content: "Donde es eso??" },
      ],
    },
    {
      user: "juanchi",
      description: "Les presento a Rocco, el nuevo integrante de la familia",
      tags: ["mascotas"],
      imagenes: ["https://picsum.photos/id/237/800/500"],
      comentarios: [
        { user: "sofi", content: "Nooo que hermosooo" },
        { user: "martin", content: "Rocco es un nombre de campeon" },
        { user: "lucia", content: "Quiero conocerlo" },
      ],
    },
    {
      user: "lucia",
      description: "Recomienden series para maratonear el finde, ya vi todo lo que tenia en la lista",
      tags: ["series"],
      comentarios: [
        { user: "Pepe", content: "Dark, sin dudas" },
        { user: "juanchi", content: "The Office si nunca la viste" },
      ],
    },
    {
      user: "martin",
      description: "Semana de comer sano, a ver cuanto dura",
      tags: ["comida"],
      imagenes: ["https://picsum.photos/id/292/800/500", "https://picsum.photos/id/429/800/500"],
      comentarios: [{ user: "Pepe", content: "Le doy hasta el miercoles" }],
    },
    {
      user: "Pawlil",
      description: "Mi playlist para estudiar: lo-fi y nada mas. Pasen las suyas",
      tags: ["musica", "unahur"],
    },
    {
      user: "Pepe",
      description: "Partido el jueves en las canchas de la facu, faltan 2 para completar",
      tags: ["futbol", "unahur"],
      comentarios: [{ user: "martin", content: "Me anoto" }],
    },
    {
      user: "sofi",
      description: "Fotos del viaje al sur, ya lo extraño",
      tags: ["viajes", "fotografia"],
      imagenes: ["https://picsum.photos/id/1036/800/500", "https://picsum.photos/id/1043/800/500", "https://picsum.photos/id/1018/800/500"],
    },
    {
      user: "juanchi",
      description: "Yo explicandole al profe que el codigo andaba en mi compu",
      tags: ["memes", "programacion"],
      comentarios: [{ user: "Pawlil", content: "Clasico jajaja" }],
    },
    {
      user: "martin",
      description: "Alguien sabe si mañana hay clases o es feriado?",
    },
  ];

  for (const p of posts) {
    const yaExiste = await Post.findOne({ where: { description: p.description } });
    if (yaExiste) continue;

    const post = await Post.create({ description: p.description, userId: usuarios[p.user].id });

    if (p.tags) {
      await post.addTags(p.tags.map((nombre) => tags[nombre]));
    }

    for (const url of p.imagenes || []) {
      await Post_Images.create({ url, postId: post.id });
    }

    for (const c of p.comentarios || []) {
      await Comment.create({ content: c.content, userId: usuarios[c.user].id, postId: post.id });
    }
  }

  // el post que ya tenia #unahur en el texto le agrego el tag
  const postUnahur = await Post.findOne({ where: { description: "Hola que onda #unahur" } });
  if (postUnahur) {
    await postUnahur.addTag(tags.unahur);
  }

  console.log("Datos cargados");
}

seed()
  .catch((error) => console.error("Error en el seed:", error))
  .finally(() => sequelize.close());
