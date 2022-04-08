import React from 'react';
import {
  Formik,
  FormikProps,
  FormikValues
} from 'formik';

export type MicroformProps = {
    name: string;
    options: any;
    children: (formikProps: any, microformsControl: any) => any;
};

export type MicroformExternalApi = {
  values: FormikValues
  validateForm: () => any;
}

export type microformsListType = {
  [key: string]: FormikProps<FormikValues>;
}

export type MicroformsControlType = {
  validateForms: (this: any) => Promise<boolean>;
  getAllValues: (this: any) => {
    [key: string]: {
      [key: string]: any;
    }
  };
  microforms: {
    [key: string]: MicroformExternalApi;
  };
};

export type MicroformsContextValueType = {
  microformsList: microformsListType;
  changeMicroformsList: (newMicroformsValue: microformsListType) => void;
  microformsControl: MicroformsControlType;
}

/**
 * Функция создает Объект контроля микроформ
 */
function createControl(): MicroformsControlType {
  return {
      validateForms: async function validateForms(this: any): Promise<boolean> {
          const microformsNames = Object.keys(this.microforms);
          const microformsValidation = microformsNames.map((microformName: string) => {
              return this.microforms[microformName].validateForm();
          });

          const validateResults = await Promise.all(microformsValidation);
          const hasMicroformsErrors = validateResults.some((validationResult: any) => {
              return (Object.keys(validationResult).length > 0);
          });

          return hasMicroformsErrors;
      },
      getAllValues: function getAllValues(this: any) {
          const formsValues: { [key: string]: any } = {};

          const microformsNames = Object.keys(this.microforms);
          microformsNames.forEach((microformName: string) => {
              formsValues[microformName] = this.microforms[microformName].values;
          });

          return formsValues;
      },
      /* Список всех микроформ */
      microforms: {},
  }
}

/**
 * Хук для создание коллекций микроформ и управления ими
 */
export function useMicroform() {
    const defaultContextValue: MicroformsContextValueType = {
      /* Список всех микроформ */
      microformsList: {},
      /* Эффект для обновления микроформ */
      changeMicroformsList: () => {},
      /* Специальный объект для управления формами извне (Внешнее API) */
      microformsControl: createControl(),
    }

    const [MicroformsContext] = React.useState(React.createContext(defaultContextValue));

    MicroformsContext.displayName = 'MicroformContext';

    const [microformsControl] = React.useState(createControl());

    function MicroformContext(props: {
      children: any;
    }) {
        const { children } = props;
        const [microformsList, changeMicroformsList] = React.useState({});

        return (
            <React.Fragment>
                <MicroformsContext.Provider value={ {
                    microformsList,
                    changeMicroformsList,
                    microformsControl,
                } }
                >
                    { children }
                </MicroformsContext.Provider>
            </React.Fragment>
        );
    }

    function Microform(props: MicroformProps) {
        const {
            name,
            options,
            children,
        } = props;

        return (
            <MicroformsContext.Consumer>
                { (microformsContextValue: MicroformsContextValueType) => (
                    <Formik
                        { ...options }
                    >
                        { (formikProps: FormikProps<FormikValues>) => (
                            <FormHelper
                                name={ name }
                                formikProps={ formikProps }
                                microformsContextValue={ microformsContextValue }
                                options={ options }
                            >
                                { children }
                            </FormHelper>
                        ) }
                    </Formik>
                ) }
            </MicroformsContext.Consumer>
        );
    }

    type FormHelperProps = {
      name: string;
      formikProps: FormikProps<FormikValues>,
      microformsContextValue: MicroformsContextValueType,
      options: any;
      children: (formikProps: any, microformsControl: any) => any;
    }

    function FormHelper(props: FormHelperProps) {
        const {
            name: microformName,
            formikProps,
            microformsContextValue,
            children,
        } = props;

        const {
            microformsList: microforms,
            changeMicroformsList,
            microformsControl: control,
        } = microformsContextValue;

        /* При изменении формы обновляем ссылки для внешнего API */
        React.useEffect(() => {
            control.microforms[microformName] = {
                values: formikProps.values,
                validateForm: formikProps.validateForm,
            };

            return function cleanup() {
                delete microforms[microformName];
            };
        }, [formikProps]); // eslint-disable-line

        /* При изменении значений формы вызывается хук для принудительного рендера MacroForm чтобы дочерние элементы так же получили рендер с новыми значениями */
        React.useEffect(() => {
            changeMicroformsList({
                ...microforms,
            });
        }, [formikProps.values]);  // eslint-disable-line

        return (
            <React.Fragment>
                { children(formikProps, microformsControl) }
            </React.Fragment>
        );
    }

    const [api] = React.useState({
        MicroformContext,
        Microform,
        microformsControl,
    });

    return api;
}

