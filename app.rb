require 'rubygems'
require 'sinatra'

get '/spec/javascripts/:file' do
  send_file "spec/javascripts/#{params[:file]}"
end

get '/jasmine-1.2.0/:file' do
  send_file "spec/jasmine-1.2.0/#{params[:file]}"
end

get '/ci' do
send_file 'spec/SpecRunner.html'
end

get '/' do
redirect '/index.html'
end

