/*
 * SonarQube
 * Copyright (C) 2009-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Button, SubmitButton } from 'sonar-ui-common/components/controls/buttons';
import HelpTooltip from 'sonar-ui-common/components/controls/HelpTooltip';
import Select from 'sonar-ui-common/components/controls/Select';
import AlertSuccessIcon from 'sonar-ui-common/components/icons/AlertSuccessIcon';
import { Alert } from 'sonar-ui-common/components/ui/Alert';
import DeferredSpinner from 'sonar-ui-common/components/ui/DeferredSpinner';
import { translate } from 'sonar-ui-common/helpers/l10n';
import {
  AlmKeys,
  AlmSettingsInstance,
  ProjectAlmBindingResponse
} from '../../../../types/alm-settings';
import InputForBoolean from '../inputs/InputForBoolean';

export interface PRDecorationBindingRendererProps {
  formData: T.Omit<ProjectAlmBindingResponse, 'alm'>;
  instances: AlmSettingsInstance[];
  isChanged: boolean;
  isConfigured: boolean;
  isValid: boolean;
  loading: boolean;
  onFieldChange: (id: keyof ProjectAlmBindingResponse, value: string | boolean) => void;
  onReset: () => void;
  onSubmit: () => void;
  saving: boolean;
  success: boolean;
}

interface LabelProps {
  help?: boolean;
  helpParams?: T.Dict<string | JSX.Element>;
  id: string;
  optional?: boolean;
}

interface CommonFieldProps extends LabelProps {
  onFieldChange: (id: keyof ProjectAlmBindingResponse, value: string | boolean) => void;
  propKey: keyof ProjectAlmBindingResponse;
}

function optionRenderer(instance: AlmSettingsInstance) {
  return instance.url ? (
    <>
      <span>{instance.key} — </span>
      <span className="text-muted">{instance.url}</span>
    </>
  ) : (
    <span>{instance.key}</span>
  );
}

function renderLabel(props: LabelProps) {
  const { help, helpParams, optional, id } = props;
  return (
    <label className="display-flex-center" htmlFor={id}>
      {translate('settings.pr_decoration.binding.form', id)}
      {!optional && <em className="mandatory">*</em>}
      {help && (
        <HelpTooltip
          className="spacer-left"
          overlay={
            <FormattedMessage
              defaultMessage={translate('settings.pr_decoration.binding.form', id, 'help')}
              id={`settings.pr_decoration.binding.form.${id}.help`}
              values={helpParams}
            />
          }
          placement="right"
        />
      )}
    </label>
  );
}

function renderBooleanField(
  props: Omit<CommonFieldProps, 'optional'> & {
    value: boolean;
  }
) {
  const { id, value, onFieldChange, propKey } = props;
  return (
    <div className="form-field">
      {renderLabel({ ...props, optional: true })}
      <InputForBoolean
        isDefault={true}
        name={id}
        onChange={v => onFieldChange(propKey, v)}
        value={value}
      />
    </div>
  );
}

function renderField(
  props: CommonFieldProps & {
    value: string;
  }
) {
  const { id, propKey, value, onFieldChange } = props;
  return (
    <div className="form-field">
      {renderLabel(props)}
      <input
        className="input-super-large"
        id={id}
        maxLength={256}
        name={id}
        onChange={e => onFieldChange(propKey, e.currentTarget.value)}
        type="text"
        value={value}
      />
    </div>
  );
}

export default function PRDecorationBindingRenderer(props: PRDecorationBindingRendererProps) {
  const {
    formData: { key, repository, slug, summaryCommentEnabled },
    instances,
    isChanged,
    isConfigured,
    isValid,
    loading,
    saving,
    success
  } = props;

  if (loading) {
    return <DeferredSpinner />;
  }

  if (instances.length < 1) {
    return (
      <div>
        <Alert className="spacer-top huge-spacer-bottom" variant="info">
          <FormattedMessage
            defaultMessage={translate('settings.pr_decoration.binding.no_bindings')}
            id="settings.pr_decoration.binding.no_bindings"
            values={{
              link: (
                <Link to="/documentation/analysis/pull-request/#pr-decoration">
                  {translate('learn_more')}
                </Link>
              )
            }}
          />
        </Alert>
      </div>
    );
  }

  const selected = key && instances.find(i => i.key === key);
  const alm = selected && selected.alm;

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">{translate('settings.pr_decoration.binding.title')}</h1>
      </header>

      <div className="markdown small spacer-top big-spacer-bottom">
        {translate('settings.pr_decoration.binding.description')}
      </div>

      <form
        onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onSubmit();
        }}>
        <div className="form-field">
          <label htmlFor="name">
            {translate('settings.pr_decoration.binding.form.name')}
            <em className="mandatory spacer-right">*</em>
          </label>
          <Select
            autosize={true}
            className="abs-width-400"
            clearable={false}
            id="name"
            menuContainerStyle={{
              maxWidth: '210%' /* Allow double the width of the select */,
              width: 'auto'
            }}
            onChange={(instance: AlmSettingsInstance) => props.onFieldChange('key', instance.key)}
            optionRenderer={optionRenderer}
            options={instances}
            searchable={false}
            value={key}
            valueKey="key"
            valueRenderer={optionRenderer}
          />
        </div>

        {alm === AlmKeys.Bitbucket && (
          <>
            {renderField({
              help: true,
              helpParams: {
                example: (
                  <>
                    {'.../projects/'}
                    <strong>{'{KEY}'}</strong>
                    {'/repos/{SLUG}/browse'}
                  </>
                )
              },
              id: 'bitbucket.repository',
              onFieldChange: props.onFieldChange,
              propKey: 'repository',
              value: repository || ''
            })}
            {renderField({
              help: true,
              helpParams: {
                example: (
                  <>
                    {'.../projects/{KEY}/repos/'}
                    <strong>{'{SLUG}'}</strong>
                    {'/browse'}
                  </>
                )
              },
              id: 'bitbucket.slug',
              onFieldChange: props.onFieldChange,
              propKey: 'slug',
              value: slug || ''
            })}
          </>
        )}

        {alm === AlmKeys.GitHub && (
          <>
            {renderField({
              help: true,
              helpParams: { example: 'SonarSource/sonarqube' },
              id: 'github.repository',
              onFieldChange: props.onFieldChange,
              propKey: 'repository',
              value: repository || ''
            })}
            {renderBooleanField({
              help: true,
              id: 'github.summary_comment_setting',
              onFieldChange: props.onFieldChange,
              propKey: 'summaryCommentEnabled',
              value: summaryCommentEnabled === undefined ? true : summaryCommentEnabled
            })}
          </>
        )}

        {alm === AlmKeys.GitLab &&
          renderField({
            id: 'gitlab.repository',
            onFieldChange: props.onFieldChange,
            propKey: 'repository',
            value: repository || ''
          })}

        <div className="display-flex-center">
          <DeferredSpinner className="spacer-right" loading={saving} />
          {isChanged && (
            <SubmitButton className="spacer-right button-success" disabled={saving || !isValid}>
              <span data-test="project-settings__alm-save">{translate('save')}</span>
            </SubmitButton>
          )}
          {isConfigured && (
            <Button className="spacer-right" onClick={props.onReset}>
              <span data-test="project-settings__alm-reset">{translate('reset_verb')}</span>
            </Button>
          )}
          {!saving && success && (
            <span className="text-success">
              <AlertSuccessIcon className="spacer-right" />
              {translate('settings.state.saved')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
