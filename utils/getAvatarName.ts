const getAvatarName = ({ name = null, size = 80 }): string => {
	if (name) {
		return `https://eu.ui-avatars.com/api/?name=${name.replace(' ', '+')}&size=${size}`
	} else {
		return `https://eu.ui-avatars.com/api?name=&size=${size}`
	}
}

export default getAvatarName
