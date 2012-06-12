require 'rubygems'
require 'sinatra'

get '/spec/javascripts/:file' do
  cache_control :public, :no_cache
  send_file "spec/javascripts/#{params[:file]}"
end

get '/jasmine-1.2.0/:file' do
  cache_control :public, :no_cache
  send_file "spec/jasmine-1.2.0/#{params[:file]}"
end

get '/ci' do
send_file 'spec/SpecRunner.html'
end

get '/' do
cache_control :public, :must_revalidate, :max_age=>3600
send_file 'public/index.html'
end

