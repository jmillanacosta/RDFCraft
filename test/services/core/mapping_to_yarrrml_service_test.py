# import unittest
# from unittest.mock import MagicMock

# from server.models.mapping import MappingGraph
# from server.services.core.mapping_to_yarrrml_service import (
#     MappingToYARRRMLService,
# )


# class TestMappingToYARRRMLService(unittest.TestCase):
#     def setUp(self):
#         self.service = MappingToYARRRMLService()
#         self.prefixes = {"ex": "http://example.com/"}
#         self.mapping = MagicMock(spec=MappingGraph)

#     def test_convert_mapping_to_yarrrml(self):
#         expected_output = (
#             "prefixes:\n  ex: http://example.com/\n"
#         )
#         result = self.service.convert_mapping_to_yarrrml(
#             self.prefixes, self.mapping
#         )
#         print(f"result: {result}")
#         self.assertEqual(result, expected_output)


# if __name__ == "__main__":
#     unittest.main()
