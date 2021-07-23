import { FC, useEffect, useState } from 'react';
import { IHeroLink } from '@strawberrylemonade/goodhub-lib';
import Title from '../../generic/Title';
import { TextInput } from '../../generic/forms/TextInput';
import { resolveLink } from '../../../services/post-service';

interface PostLinkInputProps {
  setValue: any
  register: any
}

export const PostLinkInput: FC<PostLinkInputProps> = ({ setValue, register }) => {

  useEffect(() => {
    register('hero')
  }, [register])

  const [configuration, setConfiguration] = useState<{ url: string }>();

  const setCustomConfiguration = async (data: { url: string }) => {
    setConfiguration(data)
    const hero: IHeroLink = {
      type: 'link',
      link: {
        ...data,
        resolution: await resolveLink(data.url)
      }
    }
    setValue('hero', hero , { shouldDirty: true });
  }
  return <>
    <Title className="mb-2 hidden sm:block" size="xl">Add a link</Title>
    <TextInput
      name="url"
      description=""
      value={configuration?.url}
      onChange={(value) => setCustomConfiguration({ url: value })}
    />
  </>
};