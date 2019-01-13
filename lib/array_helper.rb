module ArrayHelper
  def squash_strings(array_of_strings)
    return '' if array_of_strings.blank?

    result = ''

    array_of_strings.each do |str|
      result += ' ' if result.length > 0
      result += str
      result += '.' unless result.ends_with?('.')
    end

    return result
  end
end
