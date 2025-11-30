"use client";

import { Flex, Form, Input, message, Select } from 'antd';
import "./create-recipe.scss";
import { Button } from '@/components/buttons/button';
import { useNavigation } from '@/utils/hooks/useNavigation';
import { addRecipe } from '@/store/useRecipesStore';
import { useState } from 'react';



interface FormValues {
  name: string;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: string;
  instructions: string;
  servings?: number;
  caloriesPerServing?: number;
  image?: string;
  tags?: string;
}

export default function CreateRecipePage() {
  const [form] = Form.useForm();
  const { router } = useNavigation();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Преобразуем данные из формы в формат для API
      const newRecipe = {
        name: values.name,
        cuisine: values.cuisine,
        difficulty: values.difficulty,
        prepTimeMinutes: Number(values.prepTimeMinutes),
        cookTimeMinutes: Number(values.cookTimeMinutes),
        servings: values.servings || 4,
        caloriesPerServing: values.caloriesPerServing || 0,
        ingredients: values.ingredients.split('\n')
          .filter(line => line.trim() !== '')
          .map(line => line.trim()),
        instructions: values.instructions.split('\n')
          .filter(line => line.trim() !== '')
          .map(line => line.trim()),
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        image: values.image || 'https://imgholder.ru/600x300/8493a8/adb9ca&text=IMAGE+HOLDER&font=kelson'
      };

      // Отправляем рецепт на сервер
      await addRecipe(newRecipe);

      messageApi.success('Рецепт успешно добавлен!');

      // Перенаправляем на главную страницу
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (error) {
      console.error('Error adding recipe:', error);
      messageApi.error('Произошла ошибка при добавлении рецепта');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    messageApi.error('Пожалуйста, заполните все обязательные поля');
  };

  return (
    <div className="create-recipe">
      {contextHolder}
      <div className="container">
        <h1 className='create-recipe__title'>Добавьте свое собственное блюдо</h1>
        <div className="create-recipe__wrapper">
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            scrollToFirstError={{ behavior: 'instant', block: 'end', focus: true }}
            style={{ paddingBlock: 32 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            disabled={isSubmitting}
          >
            <Form.Item name="name" label="Название блюда" rules={[{ required: true, message: "Название блюда обязательно для заполнения" }]}>
              <Input placeholder="Введите название блюда" />
            </Form.Item>
            <Form.Item name="country" label="Страна" rules={[{ required: true, message: "Укажите страну происхождения блюда" }]}>
              <Input placeholder="Например: Итальянская, Мексиканская" />
            </Form.Item>
            <Form.Item label="Сложность" name="complexity" rules={[{ required: true, message: "Укажите сложность приготовления" }]}>
              <Select
                placeholder="Выберите сложность"
                options={[
                  { label: 'Легко', value: 'Easy' },
                  { label: 'Средне', value: 'Medium' },
                  { label: 'Сложно', value: 'Hard' },
                ]}
              />
            </Form.Item>
            <Form.Item name="prepTimeMinutes" label="Время подготовки, мин." rules={[{ required: true, message: "Укажите время подготовки" }]}>
              <Input type="number" min="1" placeholder="Например: 15" />
            </Form.Item>
            <Form.Item name="cookTimeMinutes" label="Время готовки, мин." rules={[{ required: true, message: "Укажите время готовки" }]}>
              <Input type="number" min="1" placeholder="Например: 30" />
            </Form.Item>
            <Form.Item name="servings" label="Количество порций">
              <Input type="number" min="1" defaultValue={4} />
            </Form.Item>
            <Form.Item name="caloriesPerServing" label="Калорий на порцию">
              <Input type="number" min="0" placeholder="Например: 250" />
            </Form.Item>
            <Form.Item name="image" label="URL изображения">
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
            <Form.Item name="tags" label="Теги (через запятую)">
              <Input placeholder="быстро, вегетарианское, острое" />
            </Form.Item>
            <Form.Item name="ingredients" label="Ингредиенты" rules={[{ required: true, message: "Внесите в список необходимые ингредиенты" }]}>
              <Input.TextArea
                rows={4}
                placeholder={`Каждый ингредиент с новой строки\nНапример:\n2 помидора\n1 луковица\n100г сыра`}
              />
            </Form.Item>
            <Form.Item name="instructions" label="Инструкция" rules={[{ required: true, message: "Напишите инструкцию по приготовлению" }]}>
              <Input.TextArea
                rows={6}
                placeholder={`Каждый шаг инструкции с новой строки\nНапример:\nНарезать овощи\nОбжарить на сковороде\nДобавить специи`}
              />
            </Form.Item>
            <Form.Item label={null}>
              <Flex gap="small">
                <Button
                  className="btn create-recipe__btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Добавление...' : 'Сохранить'}
                </Button>
                <Button
                  className="btn create-recipe__btn create-recipe__btn--cancel"
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>

  )
}