import React from 'react';
import { useMicroform } from '../../src/index';
import { Field } from 'formik';

export function SimpleFunctionalComponent({ submitCallback }) {
  const { MicroformContext, Microform, microformsControl } = useMicroform();

  return (
    <div>
      <h1>Пример использования Микроформ</h1>
      <MicroformContext>
        <Microform
            name="simple-form-1"
            options={ {
                initialValues: {
                    name: '',
                    email: '',
                },
                onSubmit: () => {},
            } }
        >
          {
              (_formikProps) => {
                  return (
                      <>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Name"
                          data-testid="simple-form-1-field-name"
                        />
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          data-testid="simple-form-1-field-email"
                        />
                      </>
                  );
              }
          }
        </Microform>
        <Microform
            name="simple-form-2"
            options={ {
                initialValues: {
                    name: '',
                    email: '',
                },
                onSubmit: () => {},
            } }
        >
          {
              (_formikProps) => {
                  return (
                      <>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Name"
                          data-testid="simple-form-2-field-name"
                        />
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          data-testid="simple-form-2-field-email"
                        />
                      </>
                  );
              }
          }
        </Microform>
      </MicroformContext>
      <button onClick={ () => {
          submitCallback(microformsControl.getAllValues())
        } }>
        Вывести значения всех микроформ
      </button>
    </div>
  )
}
