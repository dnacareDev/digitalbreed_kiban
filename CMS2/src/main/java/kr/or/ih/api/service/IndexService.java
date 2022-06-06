package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;

public interface IndexService
{
	List<Marker> SelectMarkerList();

	List<Outcome> SelectOutcomeList(String user_username, int type);

	int UpdateOutcomeFileStatus(int outcome_id);

	int InsertAnalysis(String user_username, int type);
}