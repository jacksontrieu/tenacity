# http://ridingtheclutch.com/post/71345006944/how-to-add-directories-to-rake-stats
task :stats => "todolist:statsetup"

namespace :todolist do
  task :statsetup do
    require 'rails/code_statistics'
    ::STATS_DIRECTORIES << ['Commands', 'app/commands']
    ::STATS_DIRECTORIES << ['Command tests', 'test/commands']
    ::STATS_DIRECTORIES << ['Forms', 'app/forms']
    ::STATS_DIRECTORIES << ['Form tests', 'test/forms']

    # For test folders not defined in CodeStatistics::TEST_TYPES (ie: spec/)
    CodeStatistics::TEST_TYPES << 'Command tests'
    CodeStatistics::TEST_TYPES << 'Form tests'
  end
end
