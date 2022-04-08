# Mikroforms

![microforms](https://github.com/alfa-code/microforms/blob/main/assets/microforms.png?raw=true)

Библиотека позволяет создавать несколько Formik форм одновременно и получать доступ к ним через специальный объект контрола.

Библиотека позволяет:

* Создавать formik формы с отдельным, собственным значением контекста. Это полноценные формы со своим личным состоянием.
* Получить контроль над всеми микроформами, через предоставляемый объект контрола. Вы можете получить значения всех форм, выполнить валидацию всех форм, или воспользоваться API любой из формы по ее имени.

## Внимание

Смотри peer dependencies.

## Установка

```sh
yarn add @alfa-bank/corp-ao-microforms
```

## Использование

Микроформы возможно использовать только в функциональных компонентах так как они используют React Hooks.

```javascript
const { MicroMicroformContextformControl, Microform, microformsControl } = useMicroform();
```

Вызов хука возвращает объект с тремя ключами:
**MicroformContext** - Родительская оболочка, именно здесь создается контекст и контрол с помощью которого вы можете управлять всеми микроформами.
Вы должны обернуть все свои микроформы в этот компонент.
**Microform** - Компонент микроформы, обертка над компонентов Formik. Создает новую форму и привязывает ее к общему контексту и контролу управления микроформами.
Обязательным параметром является name - имя микроформы, именно под этим именем микроформа будет доступна из контрола.
Так же вы можете передать options - это все начальные значения Formik.
Микроформа в качестве children принимает render function и передает в качестве аргументов рендер функции 2 параметра:
*formikProps* - все API созданной формы, которую создает Formik
*microformsControl* - тот самый объект контрола. Через него вы можете получить доступ к значениям другой формы из текущей.
**microformsControl** - тот самый объект контрола. Через него вы можете получить доступ к любым значениям зарегистрированных форм, пользоваться их API, вызвать валидацию всех форм, получить значения всех форм.

## Примеры использования

Пример простого использования микроформ

```javascript
import React from 'react';
import { useMicroform } from '@alfa-bank/corp-ao-microforms';
import { Field } from 'formik';

function SimpleFunctionalComponent() {
  const { MicroformContext, Microform, microformsControl } = useMicroform();

  return (
    <div>
      <h1>Пример использования Микроформ</h1>
      <MicroformContext>
        <Microform
            name="websites"
            options={ { // options - это все начальные пропсы которые обычно передаются в Formik
                initialValues: {
                    name: '',
                    email: '',
                },
                onSubmit: () => {},
            } }
        >
          {
              (formikProps) => { // formikProps - API текущей формы - обычные formik пропсы
                  return (
                      <>
                        <Field type="text" name="name" placeholder="Name" />
                        <Field type="email" name="email" placeholder="Email" />
                      </>
                  );
              }
          }
        </Microform>
      </MicroformContext>
      <button onClick={ () => { alert(JSON.stringify( microformsControl.getAllValues() )) } }>
        Вывести значения всех микроформ
      </button>
    </div>
  )
}
```

Соответственно, вы можете объявлять сколько угодно Microform, вы можете даже вкладывать их друг в друга, в любом случае все микроформы будут зарегистрированы на объекте контрола microformsControl под своими именами.
