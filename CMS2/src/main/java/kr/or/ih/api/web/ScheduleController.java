package kr.or.ih.api.web;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.service.ScheduleService;

@Component
public class ScheduleController
{
	@Autowired
	private ScheduleService service;
	
	@Scheduled(fixedDelay = 100000)
	public void Scheduler()
	{
		List<Outcome> outcome = service.SelectOutcome();
		
		for(int i = 0; i < outcome.size(); i++)
		{
			File file = new File("/data/apache-tomcat-9.0.8/webapps/ROOT/" + outcome.get(i).getOutcome_file());
			
			if(file.exists())
			{
				int result = service.UpdateOutcome(outcome.get(i));
				
				if(result != 0)
				{
					int notice = service.InsertNotice(outcome.get(i));
				}
			}
		}
	}
}