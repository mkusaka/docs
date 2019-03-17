
# wip

file_names = Dir.glob('content/**/*.md') do |file|
  path_to_hash(path)
end

# file_names.reduce(:deep_merge) # with ActiveSuppurt/hash
# path.deep_merge(path2) do |_, this_val, other_val|
#   if this_val.is_a?(Array) && other_val.is_a?(Array)
#     this_val + other_val
#   else
#     other_val
#   end
# end

def path_to_hash(path)
  path_infos = relative_content(path).split('/').reverse

  (path_infos.length - 1).times do
    value = path_infos.shift
    key = path_infos.shift
    res = {}.tap do |it|
      it[key] = [value]
    end
    path_infos.unshift(res)
  end

  path_infos.shift
end

def sort_by_updated_desc(files)
  files.sort_by { |file| - File.mtime(file) }
end

def relative_content(path)
  path.gsub(/^content\//, "")
end

__EOF__

{
  "content": {
    "tensorflow_and_scikit-learn/README": "README.md"
  }
}

def nested_to_h(array)
  return array if !array.is_a?(Array) || array.is_a?(Array) && array.any? { |elm| !elm.is_a?(Array) }

  base = array.to_h
  base.each do |k, v|
    base[k] = nested_to_h(v)
  end

  base
end

directories = file_names.map { |name| File.dirname(name).gsub(/^content\//, "") }.uniq
