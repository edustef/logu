const getAvatarName = (name: string): string => {
	return `https://eu.ui-avatars.com/api/${name.replace(' ', '+')}`
}

export default getAvatarName
