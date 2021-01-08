module.exports = {
  format(value) {
    if (value.length === 4) {
      value = value.replace(/(\d{1})(\d)/, '$1.$2')
      return value
    }
    else if (value.length === 5) {
      value = value.replace(/(\d{2})(\d)/, '$1.$2')
      return value
    }
    else if (value.length === 6) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      return value
    }
    else if (value.length === 7) {
      value = value.replace(/(\d{1})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      return value
    }
    else if (value.length === 8) {
      value = value.replace(/(\d{2})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      return value
    }
    else if (value.length === 9) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      return value
    }
    else if (value.length === 10) {
      value = value.replace(/(\d{1})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      return value
    }
    else if (value.length === 11) {
      value = value.replace(/(\d{2})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      return value
    } else {
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      return value
    }

  }
}