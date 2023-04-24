import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Введите загаловок статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Введите текст статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  body("tags", "Неверный формат тэгов (укажите массив)")
    .isLength({ min: 3 })
    .isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];

export const postUpdateValidation = [
  body("title", "Введите загаловок статьи")
    .optional()
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Введите текст статьи")
    .optional()
    .isLength({
      min: 3,
    })
    .isString(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
